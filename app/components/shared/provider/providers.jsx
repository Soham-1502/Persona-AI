'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarLayout } from "@/app/components/shared/sidebar/sidebar-layout";
import { Toaster } from "@/components/ui/sonner";
import GoogleOAuthProvider from "../provider/GoogleOAuthProvider.jsx";

export default function Providers({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="persona-ai-theme"
      enableColorScheme={false}
    >
      <GoogleOAuthProvider>
        <SidebarLayout>{children}</SidebarLayout>
      </GoogleOAuthProvider>
      {/* <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      /> */}
    </NextThemesProvider>
  );
}