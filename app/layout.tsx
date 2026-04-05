import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppToaster } from "@/components/ui/toaster";
import { defaultTheme, themeStorageKey } from "@/lib/themes";
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
            __html: `try{var stored=window.localStorage.getItem(${JSON.stringify(themeStorageKey)});document.documentElement.dataset.theme=stored||${JSON.stringify(defaultTheme)};}catch(e){document.documentElement.dataset.theme=${JSON.stringify(defaultTheme)};}`,
          }}
        />
        <ThemeProvider>
          <AppToaster>{children}</AppToaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
