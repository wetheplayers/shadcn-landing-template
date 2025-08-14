import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Home page component showcasing ShadCN UI components
 * Demonstrates the integration of multiple UI components
 * @component
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ShadCN Next.js</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to your{" "}
              <span className="text-primary">ShadCN UI</span> app
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern web application built with Next.js 15.3, React 19.1, and ShadCN UI.
              Experience beautiful, accessible components with TypeScript.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Try it out</h2>
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
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full"
                />
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Built with ❤️ using Next.js, React, and ShadCN UI
            </p>
            <p className="mt-2">
              🇬🇧 Made with British standards in mind
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
