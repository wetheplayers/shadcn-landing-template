'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useAuthStore } from '@/stores/auth.store';

/**
 * Home page component showcasing ShadCN UI components
 * Redirects authenticated users to dashboard
 * @component
 */
export default function HomePage(): React.ReactElement {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
            void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if authenticated (will redirect)
  if (isAuthenticated) {
    return <div />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b" role="banner">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ShadCN Next.js</h1>
          <ThemeToggleButton variant="circle-blur" start="top-right" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6" aria-labelledby="hero-title">
            <h2 id="hero-title" className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to your{" "}
              <span className="text-primary">ShadCN UI</span> app
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern web application built with Next.js 15.3, React 19.1, and ShadCN UI.
              Experience beautiful, accessible components with TypeScript.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-labelledby="features-title">
            <h2 id="features-title" className="sr-only">Features</h2>
            <Card>
              <CardHeader>
                <CardTitle>🚀 Next.js 15.3</CardTitle>
                <CardDescription>
                  Latest Next.js with App Router and React Server Components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with the latest Next.js features including streaming, 
                  partial prerendering, and enhanced performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚛️ React 19.1</CardTitle>
                <CardDescription>
                  Modern React with improved hooks and concurrent features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                   Leveraging React 19&apos;s enhanced useActionState, 
                   automatic batching, and improved concurrent rendering.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 ShadCN UI</CardTitle>
                <CardDescription>
                  Beautiful, accessible, and customisable components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Copy-paste components built on Radix UI and styled 
                  with Tailwind CSS for maximum customisation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📱 Mobile First</CardTitle>
                <CardDescription>
                  Responsive design with mobile-first approach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with mobile-first responsive design principles 
                  ensuring great experience across all devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌓 Dark Mode</CardTitle>
                <CardDescription>
                  Built-in dark mode with smooth transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  System-aware theme switching with next-themes 
                  and CSS variables for consistent styling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 TypeScript</CardTitle>
                <CardDescription>
                  Fully typed with strict TypeScript configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  End-to-end type safety with strict TypeScript, 
                  proper error handling, and comprehensive documentation.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Interactive Demo */}
          <section className="space-y-6" aria-labelledby="demo-title">
            <div className="text-center">
              <h2 id="demo-title" className="text-3xl font-bold tracking-tight">Try it out</h2>
              <p className="text-muted-foreground mt-2">
                Interactive demonstration of form components
              </p>
            </div>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Subscribe to Updates</CardTitle>
                <CardDescription>
                  Enter your email to receive the latest updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subscribe-email" className="sr-only">Email address</Label>
                  <Input
                    id="subscribe-email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full"
                    aria-describedby="subscribe-description"
                  />
                </div>
                <Button className="w-full" aria-describedby="subscribe-description">Subscribe</Button>
                <p id="subscribe-description" className="text-xs text-muted-foreground">
                  We&apos;ll send you updates about new features and improvements.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Built with ❤️ by Paul Buttle using Next.js, React, and ShadCN UI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
