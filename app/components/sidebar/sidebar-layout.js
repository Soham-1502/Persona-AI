"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/components/sidebar/Sidebar";

export function SidebarLayout({ children }) {

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
