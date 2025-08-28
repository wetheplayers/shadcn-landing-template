import { Geist, Geist_Mono } from "next/font/google";

import { SkipLinks } from "@/components/accessibility/skip-links";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { WebVitalsMonitor } from "@/components/performance/web-vitals";
import { Toaster } from "@/components/ui/sonner";

import type { Metadata } from "next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShadCN Next.js App",
  description: "A modern web application built with Next.js 15.3, React 19.1, and ShadCN UI",
  metadataBase: new URL("https://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <SkipLinks />
            <main id="main-content" role="main">{children}</main>
            <Toaster />
            <WebVitalsMonitor />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
