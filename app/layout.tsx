import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppToaster } from "@/components/ui/toaster";
import {
  defaultMode,
  defaultTheme,
  modeStorageKey,
  themeStorageKey,
} from "@/lib/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRMS",
  description: "Police Record Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var storedTheme=window.localStorage.getItem(${JSON.stringify(themeStorageKey)});var storedMode=window.localStorage.getItem(${JSON.stringify(modeStorageKey)});document.documentElement.dataset.theme=storedTheme||${JSON.stringify(defaultTheme)};document.documentElement.dataset.mode=storedMode||((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":${JSON.stringify(defaultMode)});}catch(e){document.documentElement.dataset.theme=${JSON.stringify(defaultTheme)};document.documentElement.dataset.mode=${JSON.stringify(defaultMode)};}`,
          }}
        />
        <ThemeProvider>
          <AppToaster>{children}</AppToaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
