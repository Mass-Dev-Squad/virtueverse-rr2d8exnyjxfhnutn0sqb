import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
export function AppLayout(): JSX.Element {
  const isAuthenticated = useAuth(s => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-muted/40">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-screen">
            <Outlet />
          </main>
          <Toaster richColors />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}