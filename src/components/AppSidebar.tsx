import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Leaf, Trophy, LogOut, ShieldCheck, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
export function AppSidebar(): JSX.Element {
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Leaf className="text-white size-5" />
          </div>
          <span className="font-bold text-lg">VirtueVerse</span>
        </div>
        <SidebarTrigger className="lg:hidden">
          <Menu className="size-5" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/dashboard" className={({ isActive }) => isActive ? "bg-accent text-accent-foreground" : ""}>
                <Home /> <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/deeds" className={({ isActive }) => isActive ? "bg-accent text-accent-foreground" : ""}>
                <Leaf /> <span>Submit a Deed</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/leaderboard" className={({ isActive }) => isActive ? "bg-accent text-accent-foreground" : ""}>
                <Trophy /> <span>Leaderboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user?.role === 'admin' && (
            <>
              <SidebarSeparator />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/admin/verify" className={({ isActive }) => isActive ? "bg-accent text-accent-foreground" : ""}>
                    <ShieldCheck /> <span>Admin Verification</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
        <div className="mt-auto">
          {user && (
            <div className="p-2 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}