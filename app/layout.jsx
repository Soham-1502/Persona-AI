import "./globals.css";
import Providers from "./components/shared/provider/providers";
import CustomCursor from "./components/shared/CustomCursor/CustomCursor";

export const metadata = {
  title: "PersonaAI",
  description: "Your AI-Powered Personal Growth Companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}