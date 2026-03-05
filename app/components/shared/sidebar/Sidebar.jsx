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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { sidebarItems } from "./SidebarItems";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Assets } from "../../../../assets/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EllipsisVertical, PanelRightOpen, PanelLeftOpen, UserPen, LogOut, Settings, MessageCircleQuestionMark, Camera, User as UserIcon, AtSign, FileText, Save, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const router = useRouter();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Profile modal states
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    picture: "",
  });

  // ✅ ADD USER STATE
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
    picture: null,
  });

  // Only render theme-dependent content after mounting
  useEffect(() => {
    setMounted(true);

    // ✅ FETCH USER DATA FROM LOCALSTORAGE
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          name: userData.name || "Guest User",
          email: userData.email || "guest@example.com",
          picture: userData.picture || null,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const isDarkMode = resolvedTheme === "dark";

  // Glassmorphism styles matching the header
  const glassStyle = {
    backgroundColor: isLight ? 'rgba(232, 224, 240, 0.5)' : 'rgba(10, 8, 16, 0.1)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  };

  // ✅ GET INITIALS FOR AVATAR FALLBACK
  const getInitials = (name) => {
    if (!name) return "GU";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm((f) => ({ ...f, picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open profile modal and prefill form
  function handleOpenProfile() {
    const storedUser = localStorage.getItem("user");
    let userData = {};
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
      } catch (_) { }
    }

    const nameParts = (userData.name || "").split(" ");
    setProfileForm({
      firstName: userData.firstName || nameParts[0] || "",
      lastName: userData.lastName || nameParts.slice(1).join(" ") || "",
      username: userData.username || "",
      bio: userData.bio || "",
      picture: userData.picture || "",
    });

    setOpenProfileModal(true);
  }

  async function handleSaveProfile() {
    setIsSavingProfile(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          username: profileForm.username,
          bio: profileForm.bio,
          picture: profileForm.picture,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }

      // Update localStorage with new user info
      const storedUser = localStorage.getItem("user");
      const existingUser = storedUser ? JSON.parse(storedUser) : {};
      const updatedUser = {
        ...existingUser,
        name: data.user.name,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        username: data.user.username,
        picture: data.user.picture,
        bio: data.user.bio,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update sidebar display
      setUser({
        name: data.user.name,
        email: data.user.email || existingUser.email,
        picture: data.user.picture || null,
      });

      toast.success("Profile updated successfully!");
      setOpenProfileModal(false);
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error("Could not save profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  function handleLogout() {
    setIsLoggingOut(true);

    // Clear authentication data directly
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Show success message
    toast.success('Logged out successfully');

    // Small delay for UX, then redirect
    setTimeout(() => {
      setIsLoggingOut(false);
      setOpenLogoutDialog(false);
      router.push('/login');
    }, 500);
  }

  if (!mounted) return null;

  return (
    <Sidebar
      data-sidebar="sidebar"
      className="h-screen"
      collapsible="icon"
      style={{
        ...glassStyle,
        borderRight: isLight ? '1px solid rgba(101, 90, 124, 0.12)' : '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* HEADER */}
      <SidebarHeader
        className="h-20 py-4"
        style={{
          borderBottom: isLight ? '1px solid rgba(101, 90, 124, 0.12)' : '1px solid rgba(255, 255, 255, 0.06)',
          background: 'transparent',
        }}
      >
        <div className="h-full flex items-center justify-between px-2 group-data-[collapsible=icon]:px-0">
          {/* Logo + text */}
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Logo icon - suppress hydration warning for theme-dependent rendering */}
            <div className="w-10 h-10 rounded-xl dark:bg-background flex items-center justify-center border border-primary shrink-0 group/logo" suppressHydrationWarning>
              {mounted ? (
                <Image
                  src={isDarkMode ? Assets.logo_dark : Assets.logo_light}
                  className="w-7.5 h-8"
                  alt="PersonaAI Logo"
                />
              ) : (
                <Image
                  src={Assets.logo_light}
                  className="w-7.5 h-8"
                  alt="PersonaAI Logo"
                />
              )}
            </div>

            {/* Brand text – hide when collapsed */}
            <span className="text-foreground dark:text-foreground text-xl font-semibold tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
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
      <SidebarContent className="py-1 px-1" style={{ background: 'transparent' }}>
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
                      className={`gap-3 relative rounded-lg transition-colors ${isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:text-persona-cream dark:hover:bg-accent/90 font-semibold shadow-md h-10" : "text-sidebar-foreground font-medium hover:bg-primary/10 hover:text-primary dark:text-persona-cream/80 dark:hover:bg-white/5 dark:hover:text-persona-cream h-10"}`}
                    >
                      <Link
                        href={item.href}
                        className="flex w-fit items-center px-2"
                      >
                        <span className={cn(isCollapsed ? "-ml-1 scale-80" : "ml-0 scale-80")}>
                          {item.icon}
                        </span>
                        <span className={`text-[15px] font-medium truncate ${isActive ? "font-semibold" : "font-normal"} ${isCollapsed ? "hidden" : ""}`}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter
        className="group/footer"
        style={{
          borderTop: isLight ? '1px solid rgba(101, 90, 124, 0.12)' : '1px solid rgba(255, 255, 255, 0.08)',
          background: 'transparent',
        }}
      >
        <SidebarMenu className="group-data-[collapsible=icon]:ml-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex items-center h-auto hover:bg-primary/10 dark:hover:bg-white/10 text-sidebar-foreground active:bg-primary/15 dark:active:bg-white/15 rounded-lg transition-colors group-data-[collapsible=icon]:justify-center"
            >
              <div className="relative flex items-center w-full rounded-lg cursor-pointer group-data-[collapsible=icon]:justify-center">

                {/* LEFT: Avatar + text */}
                <div className="flex items-center gap-3 flex-1 min-w-0 group-data-[collapsible=icon]:hidden">

                  {/* Avatar (strict size, never shrink) */}
                  <div className="relative w-8 h-8 shrink-0">
                    <Avatar className="w-8 h-8 rounded-lg">
                      <AvatarImage
                        src={user.picture || "https://github.com/shadcn.png"}
                        alt={user.name}
                      />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>

                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-persona-dark" />
                  </div>

                  {/* Text block (flexible, truncates) */}
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-sm font-semibold truncate text-foreground" title={user.name}>
                      {user.name}
                    </span>

                    <span
                      className="text-xs truncate text-muted-foreground"
                      title={user.email}
                    >
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* RIGHT: Menu button (fixed) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="User options"
                      className="w-9 h-9 shrink-0 rounded-lg flex items-center text-sidebar-foreground dark:text-persona-cream/70 justify-center hover:bg-primary/10 dark:hover:bg-white/10 active:bg-primary/20 dark:active:bg-white/15 transition-colors"
                    >
                      <EllipsisVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 border dark:border-white/10 dark:text-persona-cream shadow-xl backdrop-blur-[12px] bg-background/80"
                    side={isMobile ? "top" : "right"}
                    align={isMobile ? "center" : "end"}
                    sideOffset={isMobile ? 26 : (isCollapsed ? 23 : 29)}
                    alignOffset={isMobile ? 0 : (isCollapsed ? 0 : -12)}
                  >
                    <DropdownMenuLabel className="font-semibold text-foreground dark:text-persona-cream/90">
                      My Account
                    </DropdownMenuLabel>

                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={handleOpenProfile} className="text-foreground dark:text-persona-cream/80 hover:bg-primary/10 dark:hover:bg-white/10 cursor-pointer focus:bg-primary/10 dark:focus:bg-white/10 transition-colors">
                        <UserPen className="size-4" /> Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-foreground dark:text-persona-cream/80 hover:bg-primary/10 dark:hover:bg-white/10 cursor-pointer focus:bg-primary/10 dark:focus:bg-white/10 transition-colors">
                        <Settings className="size-4" /> Settings
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-foreground dark:text-persona-cream/80 hover:bg-primary/10 dark:hover:bg-white/10 cursor-pointer focus:bg-primary/10 dark:focus:bg-white/10 transition-colors">
                        <MessageCircleQuestionMark className="size-4" />
                        Help & Support
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="dark:bg-black/10" />

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setOpenLogoutDialog(true)}
                      className={cn(
                        "cursor-pointer",
                        "dark:text-persona-cream/80 dark:hover:bg-white/10 dark:hover:text-persona-cream",
                        "hover:text-persona-cream hover:bg-red"
                      )}
                    >
                      <LogOut className="text-red" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout dialog */}
                <AlertDialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Log out of PersonaAI?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You can log back in anytime to continue your journey.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer hover:bg-persona-indigo hover:text-black">
                        Cancel
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                      >
                        <LogOut />
                        {isLoggingOut ? "Logging out..." : "Log out"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* ─── PROFILE MODAL ─── */}
      <Dialog open={openProfileModal} onOpenChange={setOpenProfileModal}>
        <DialogContent className="sm:max-w-[500px] dark:bg-persona-dark dark:border-white/10 dark:text-persona-cream p-0 overflow-hidden">
          {/* Modal Header with gradient */}
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-transparent px-6 pt-6 pb-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold dark:text-white">Edit Profile</DialogTitle>
              <p className="text-sm text-muted-foreground dark:text-persona-cream/60 mt-1">
                Update your personal information
              </p>
            </DialogHeader>

            {/* Avatar preview + picture URL */}
            <div className="mt-5 flex items-center gap-4">
              <div className="relative shrink-0 group">
                <label className="cursor-pointer">
                  <Avatar className="w-16 h-16 rounded-2xl ring-2 ring-primary/30 transition-opacity group-hover:opacity-80">
                    <AvatarImage
                      src={profileForm.picture || "https://github.com/shadcn.png"}
                      alt="Profile preview"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg rounded-2xl">
                      {getInitials(`${profileForm.firstName} ${profileForm.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground dark:text-persona-cream/60 uppercase tracking-wider flex justify-between items-center">
                  <span>Profile Picture URL (Optional)</span>
                  {profileForm.picture?.startsWith('data:image') && (
                    <span className="text-green-500 font-semibold normal-case">Local image ready</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={profileForm.picture?.startsWith('data:image') ? "Local image attached..." : "https://example.com/avatar.jpg"}
                  value={profileForm.picture?.startsWith('data:image') ? "" : profileForm.picture}
                  onChange={(e) => setProfileForm((f) => ({ ...f, picture: e.target.value }))}
                  disabled={profileForm.picture?.startsWith('data:image')}
                  className="mt-1 w-full text-sm px-3 py-2 rounded-lg border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 dark:text-persona-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {profileForm.picture?.startsWith('data:image') && (
                  <button
                    type="button"
                    onClick={() => setProfileForm(f => ({ ...f, picture: "" }))}
                    className="mt-1.5 text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer font-medium"
                  >
                    Remove local image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="px-6 py-5 space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-persona-cream/60 uppercase tracking-wider mb-1.5">
                  <UserIcon className="w-3 h-3" /> First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 dark:text-persona-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-persona-cream/60 uppercase tracking-wider mb-1.5">
                  <UserIcon className="w-3 h-3" /> Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 dark:text-persona-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-persona-cream/60 uppercase tracking-wider mb-1.5">
                <AtSign className="w-3 h-3" /> Username
              </label>
              <input
                type="text"
                placeholder="johndoe"
                value={profileForm.username}
                onChange={(e) => setProfileForm((f) => ({ ...f, username: e.target.value }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 dark:text-persona-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground dark:text-persona-cream/60 uppercase tracking-wider mb-1.5">
                <FileText className="w-3 h-3" /> Bio
              </label>
              <textarea
                rows={3}
                placeholder="Tell us a little about yourself..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-border dark:border-white/10 bg-background/50 dark:bg-white/5 dark:text-persona-cream placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <DialogFooter className="px-6 py-4 border-t dark:border-white/10 bg-black/5 dark:bg-white/3 flex gap-2">
            <button
              onClick={() => setOpenProfileModal(false)}
              disabled={isSavingProfile}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border dark:border-white/10 text-sm font-medium text-muted-foreground dark:text-persona-cream/70 hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-sm font-semibold text-white shadow-persona-purple hover:shadow-persona-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Sidebar>
  );
}