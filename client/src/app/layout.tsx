import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A production-grade todo application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 antialiased transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Background decorative blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200 opacity-30 blur-3xl dark:bg-purple-900 dark:opacity-20" />
          <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-indigo-200 opacity-30 blur-3xl dark:bg-indigo-900 dark:opacity-20" />
          <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-pink-200 opacity-20 blur-3xl dark:bg-pink-900 dark:opacity-10" />
        </div>
        <QueryProvider>
          <ThemeToggle />
          <main className="relative">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
