"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { sidebarItems } from "./SidebarItems";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Assets } from "../../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { EllipsisVertical, PanelRightOpen, PanelLeftOpen, UserPen, LogOut, Settings, MessageCircleQuestionMark } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  function handleLogout() {
    // Fake delay to simulate API / auth call
    setTimeout(() => {
      // TODO: replace with real sign-out logic
      console.log("Logged out");
      // e.g. router.push("/login");
    }, 1500); // 1.5s delay
  }

  return (
    <Sidebar
    data-sidebar="sidebar"
      className="h-screen border-r dark:border-white/10"
      collapsible="icon"
    >
      {/* HEADER */}
      <SidebarHeader className="h-20 py-4 border-b dark:border-white/10 bg-sidebar-foreground dark:bg-sidebar">
        <div className="h-full flex items-center justify-between px-2 group-data-[collapsible=icon]:px-0">
          {/* Logo + text */}
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Logo icon */}
            <div className="w-10 h-10 rounded-xl dark:bg-background flex items-center justify-center border border-primary shrink-0 group/logo">
              <Image
                src={isDarkMode ? Assets.logo_dark : Assets.logo_light}
                className="w-7.5 h-8"
                alt="PersonaAI Logo"
              />
            </div>

            {/* Brand text — hide when collapsed */}
            <span className="text-persona-dark dark:text-foreground text-xl font-semibold tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
              Persona
              <span className="font-bold text-sidebar-primary">AI</span>
            </span>
          </div>

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/20 dark:hover:bg-white/10 dark:text-persona-cream/70 text-foreground shrink-0 cursor-pointer group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:-translate-x-1/2"
            aria-label="Toggle sidebar"
          >
            {/* expanded icon */}
            <PanelRightOpen className="w-5 h-5 group-data-[collapsible=icon]:hidden" />
            {/* collapsed icon */}
            <PanelLeftOpen className="w-5 h-5 hidden group-data-[collapsible=icon]:inline-block" />
          </button>
        </div>
      </SidebarHeader>

      {/* NAV */}
      <SidebarContent className="py-1 bg-sidebar-foreground dark:bg-sidebar px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="h-9 group-data-[collapsible=icon]:h-8"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`text-foreground dark:text-foreground gap-3 relative rounded-lg hover:bg-primary/50 hover:border-persona-indigo dark:hover:bg-accent/30 dark:active:bg-accent/50 ${isActive ? "bg-primary hover:bg-primary dark:bg-accent dark:hover:bg-accent font-semibold border-persona-indigo dark:text-persona-cream h-10" : "h-10"}`}
                    >
                      <a
                        href={item.href}
                        className="flex w-fit items-center px-2"
                      >
                        <span className={cn(isCollapsed ? "-ml-1 scale-80" : "ml-0 scale-80")}>
                          {item.icon}
                        </span>
                        <span className={`text-[15px] font-medium truncate ${isActive ? "font-semibold" : "font-normal"} ${isCollapsed ? "hidden" : ""}`}>
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-black/20 dark:border-white/15 bg-sidebar-foreground dark:bg-sidebar group/footer">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex justify-center items-center h-auto hover:bg-black/20 text-foreground active:bg-white/10"
            >
              <div className="text-foreground relative flex items-center w-full rounded-lg group-hover/footer:bg-white/10 cursor-pointer group-data-[collapsible=icon]:ml-1">
                {/* Avatar + info (hide entirely when collapsed) */}
                <div className="flex items-center justify-center gap-3 w-full group-data-[collapsible=icon]:w-0">
                  <div className="relative shrink-0 w-8 group-data-[collapsible=icon]:w-0">
                    <Avatar className="rounded-lg group-data-[collapsible=icon]:w-0">
                      <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-persona-dark group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:-translate-x-4" />
                  </div>
                  <div className="flex flex-col text-left flex-1 min-w-0 text-foreground dark:text-foreground group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold truncate">
                      John Doe
                    </span>
                    <span className="text-xs truncate">
                      johndoe@gmail.com
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="User options"
                      className="w-9 h-9 rounded-lg text-foreground flex items-center justify-center cursor-pointer shrink-0 hover:bg-black/20 active:bg-black/30 dark:text-persona-cream/60 dark:hover:text-persona-cream dark:hover:bg-white/5 dark:active:bg-white/10 group-data-[collapsible=icon]:absolute"
                    >
                      <EllipsisVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 dark:bg-persona-dark border dark:border-white/10 dark:text-persona-cream shadow-persona-purple"
                    side="right"
                    align="end"
                    sideOffset={isCollapsed ? 17 : 23}
                    alignOffset={isCollapsed ? 2 : -12}
                  >
                    <DropdownMenuLabel className="dark:text-persona-cream/90 font-semibold">
                      My Account
                    </DropdownMenuLabel>

                    <DropdownMenuGroup>
                      <DropdownMenuItem className="text-persona-cream/80 hover:bg-black/20 hover:text-persona-cream focus:bg-black/20 focus:text-persona-cream cursor-pointer">
                        <UserPen className="dark:text-white" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-persona-cream/80 hover:bg-black/20 hover:text-persona-cream focus:bg-black/20 focus:text-persona-cream cursor-pointer">
                        <Settings className="dark:text-white" />Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-persona-cream/80 hover:bg-black/20 hover:text-persona-cream focus:bg-black/20 focus:text-persona-cream cursor-pointer">
                        <MessageCircleQuestionMark className="dark:text-white" />Help &amp; Support
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="dark:bg-black/10" />
                    <DropdownMenuItem variant="destructive" onClick={() => { setOpenLogoutDialog(true) }} className={cn("cursor-pointer", "dark:text-persona-cream/80 dark:hover:bg-white/10 dark:hover:text-persona-cream dark:focus:bg-white/10 dark:focus:text-persona-cream", "hover:text-persona-cream hover:bg-red focus:text-persona-cream")}>
                      <LogOut className="text-red" />Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout confirmation dialog */}
                <AlertDialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Log out of PersonaAI?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You can log back in anytime to continue your journey.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer hover:bg-persona-indigo hover:text-black">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white cursor-pointer">
                        <LogOut />
                        Log out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}