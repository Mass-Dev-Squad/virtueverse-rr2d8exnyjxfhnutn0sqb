import { IndexedEntity } from "./core-utils";
import type { User, Deed, DeedCatalogItem } from "@shared/types";
// USER ENTITY
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', password: 'password123', role: 'user', credits: 12 },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', password: 'password123', role: 'user', credits: 8 },
  { id: 'admin', name: 'Admin', email: 'admin@example.com', password: 'admin', role: 'admin', credits: 0 },
];
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", role: 'user', credits: 0 };
  static seedData = MOCK_USERS;
  static keyOf = (u: { email: string }) => u.email;
}
// DEED CATALOG ENTITY
const SEED_DEED_CATALOG: DeedCatalogItem[] = [
    { id: 'deed-1', title: 'Community Garden Helper', description: 'Spend an hour helping at the local community garden.', category: 'Environment', creditValue: 5, illustrationUrl: '/illustrations/gardening.svg' },
    { id: 'deed-2', title: 'Neighbor Grocery Run', description: 'Help an elderly or disabled neighbor with their grocery shopping.', category: 'Community Support', creditValue: 3, illustrationUrl: '/illustrations/groceries.svg' },
    { id: 'deed-3', title: 'Park Cleanup', description: 'Participate in a local park cleanup event.', category: 'Environment', creditValue: 4, illustrationUrl: '/illustrations/cleanup.svg' },
    { id: 'deed-4', title: 'Tutor a Student', description: 'Offer one hour of free tutoring to a local student.', category: 'Education', creditValue: 5, illustrationUrl: '/illustrations/tutoring.svg' },
    { id: 'deed-5', title: 'Donate Blood', description: 'Donate blood at a local blood drive.', category: 'Health', creditValue: 10, illustrationUrl: '/illustrations/blood-donation.svg' },
    { id: 'deed-6', title: 'Walk a Shelter Dog', description: 'Volunteer to walk a dog at the local animal shelter.', category: 'Animal Welfare', creditValue: 3, illustrationUrl: '/illustrations/dog-walking.svg' },
];
export class DeedCatalogEntity extends IndexedEntity<DeedCatalogItem> {
    static readonly entityName = "deedCatalog";
    static readonly indexName = "deedCatalogItems";
    static readonly initialState: DeedCatalogItem = { id: "", title: "", description: "", category: "", creditValue: 0, illustrationUrl: "" };
    static seedData = SEED_DEED_CATALOG;
}
// DEED ENTITY
const MOCK_DEEDS: Deed[] = [
    { id: 'd1', userId: 'u1', deedType: 'Community Garden Helper', description: 'Helped weed the vegetable patch.', proofUrl: 'https://example.com/proof.jpg', status: 'verified', creditsAwarded: 5, createdAt: Date.now() - 86400000 * 2, verifiedAt: Date.now() - 86400000, verifiedBy: 'admin' },
    { id: 'd2', userId: 'u2', deedType: 'Park Cleanup', description: 'Collected two bags of trash from the park.', proofUrl: 'https://example.com/proof.jpg', status: 'verified', creditsAwarded: 4, createdAt: Date.now() - 86400000 * 3, verifiedAt: Date.now() - 86400000, verifiedBy: 'admin' },
    { id: 'd3', userId: 'u1', deedType: 'Neighbor Grocery Run', description: 'Got groceries for Mrs. Gable.', proofUrl: 'https://example.com/proof.jpg', status: 'pending', creditsAwarded: 0, createdAt: Date.now() - 86400000, },
];
export class DeedEntity extends IndexedEntity<Deed> {
    static readonly entityName = "deed";
    static readonly indexName = "deeds";
    static readonly initialState: Deed = { id: "", userId: "", deedType: "", description: "", proofUrl: "", status: 'pending', creditsAwarded: 0, createdAt: 0 };
    static seedData = MOCK_DEEDS;
}