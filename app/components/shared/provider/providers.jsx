'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarLayout } from "@/app/components/shared/sidebar/sidebar-layout";
import GoogleOAuthWrapper from "../provider/GoogleOAuthProvider";

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
      <GoogleOAuthWrapper>
        <SidebarLayout>{children}</SidebarLayout>
      </GoogleOAuthWrapper>
    </NextThemesProvider>
  );
}