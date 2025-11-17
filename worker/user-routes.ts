import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, DeedEntity, DeedCatalogEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { User, Deed, DeedCatalogItem } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data on first load
  app.use('*', async (c, next) => {
    await Promise.all([
      UserEntity.ensureSeed(c.env),
      DeedCatalogEntity.ensureSeed(c.env),
      DeedEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json<{ email?: string; password?: string }>();
    if (!isStr(email) || !isStr(password)) return bad(c, 'Email and password required');
    const userEntity = new UserEntity(c.env, email);
    if (!(await userEntity.exists())) return notFound(c, 'Invalid credentials');
    const state = await userEntity.getState();
    if (state.password !== password) return bad(c, 'Invalid credentials');
    const { password: _, ...userResponse } = state;
    return ok(c, userResponse);
  });
  app.post('/api/auth/signup', async (c) => {
    const { name, email, password } = await c.req.json<{ name?: string; email?: string; password?: string }>();
    if (!isStr(name) || !isStr(email) || !isStr(password)) return bad(c, 'Name, email, and password required');
    const userEntity = new UserEntity(c.env, email);
    if (await userEntity.exists()) return bad(c, 'User with this email already exists');
    const newUser: User = { id: crypto.randomUUID(), name, email, password, role: 'user', credits: 0 };
    await UserEntity.create(c.env, newUser);
    const { password: _, ...userResponse } = newUser;
    return ok(c, userResponse);
  });
  // PROFILE
  app.get('/api/profile/:email', async (c) => {
    const email = c.req.param('email');
    const userEntity = new UserEntity(c.env, email);
    if (!(await userEntity.exists())) return notFound(c, 'User not found');
    const state = await userEntity.getState();
    const { password: _, ...userResponse } = state;
    return ok(c, userResponse);
  });
  // DEED CATALOG
  app.get('/api/deeds/catalog', async (c) => {
    const { items } = await DeedCatalogEntity.list(c.env);
    return ok(c, items);
  });
  // DEEDS
  app.get('/api/deeds/:userId', async (c) => {
    const userId = c.req.param('userId');
    const { items: allDeeds } = await DeedEntity.list(c.env);
    const userDeeds = allDeeds.filter(d => d.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, userDeeds);
  });
  app.post('/api/deeds', async (c) => {
    const { userId, deedType, description, proofUrl } = await c.req.json<Partial<Deed>>();
    if (!isStr(userId) || !isStr(deedType) || !isStr(description) || !isStr(proofUrl)) {
      return bad(c, 'Missing required fields');
    }
    const newDeed: Deed = {
      id: crypto.randomUUID(),
      userId,
      deedType,
      description,
      proofUrl,
      status: 'pending',
      creditsAwarded: 0,
      createdAt: Date.now(),
    };
    await DeedEntity.create(c.env, newDeed);
    return ok(c, newDeed);
  });
  // LEADERBOARD
  app.get('/api/leaderboard', async (c) => {
    const { items: users } = await UserEntity.list(c.env);
    const leaderboard = users
      .filter(u => u.role === 'user')
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 10)
      .map(({ id, name, credits }) => ({ id, name, credits }));
    return ok(c, leaderboard);
  });
  // ADMIN ROUTES
  app.get('/api/admin/deeds/pending', async (c) => {
    const { items: allDeeds } = await DeedEntity.list(c.env);
    const { items: allUsers } = await UserEntity.list(c.env);
    const usersById = new Map(allUsers.map(u => [u.id, u]));
    const pendingDeeds = allDeeds
      .filter(d => d.status === 'pending')
      .map(d => ({ ...d, userName: usersById.get(d.userId)?.name ?? 'Unknown User' }))
      .sort((a, b) => a.createdAt - b.createdAt);
    return ok(c, pendingDeeds);
  });
  app.post('/api/admin/deeds/verify', async (c) => {
    const { deedId, status } = await c.req.json<{ deedId?: string; status?: 'verified' | 'rejected' }>();
    if (!isStr(deedId) || !isStr(status)) return bad(c, 'Deed ID and status are required');
    if (status !== 'verified' && status !== 'rejected') return bad(c, 'Invalid status');
    const deedEntity = new DeedEntity(c.env, deedId);
    if (!(await deedEntity.exists())) return notFound(c, 'Deed not found');
    const deed = await deedEntity.getState();
    if (deed.status !== 'pending') return bad(c, 'Deed is not pending verification');
    if (status === 'verified') {
      const { items: catalogItems } = await DeedCatalogEntity.list(c.env);
      const catalogItem = catalogItems.find(item => item.title === deed.deedType);
      const creditsToAward = catalogItem?.creditValue ?? 1;
      await deedEntity.patch({ status: 'verified', creditsAwarded: creditsToAward, verifiedAt: Date.now() });
      const { items: allUsers } = await UserEntity.list(c.env);
      const userToUpdate = allUsers.find(u => u.id === deed.userId);
      if (userToUpdate) {
        const userEntity = new UserEntity(c.env, userToUpdate.email);
        await userEntity.mutate(u => ({ ...u, credits: u.credits + creditsToAward }));
      }
    } else { // rejected
      await deedEntity.patch({ status: 'rejected' });
    }
    return ok(c, { message: `Deed successfully ${status}.` });
  });
}