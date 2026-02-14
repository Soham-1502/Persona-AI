'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarLayout } from "@/app/components/shared/sidebar/sidebar-layout";
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
    </NextThemesProvider>
  );
}