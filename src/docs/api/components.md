# Component Library

This document provides comprehensive documentation for all UI components in the Next.js application. All components are built with TypeScript, follow accessibility standards, and integrate seamlessly with the design system.

## Component Categories

### 🎨 Base UI Components
Core components built on ShadCN/ui with Radix primitives and strict TypeScript support.

### 🧩 Custom Components
Application-specific components for navigation, layout, and user interface elements.

### 📝 Form Components
Form-related components with React Hook Form, Zod validation, and accessibility features.

### 🎯 Performance Components
Optimized components for virtualization, large datasets, and Core Web Vitals optimization.

### 🏗️ Layout Components
Layout and navigation components for application structure.

### 📊 Data Display Components
Components for displaying data, charts, and performance metrics.

### 🔐 Authentication Components
User authentication forms and related UI components.

## Base UI Components

### Avatar

A user avatar component built on Radix UI primitives with image fallback support.

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  className?: string;
}

interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
  className?: string;
}

interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic avatar with image and fallback
<Avatar>
  <AvatarImage src="/avatars/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Custom sizes
<Avatar className="h-12 w-12">
  <AvatarImage src="/avatars/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Fallback only
<Avatar>
  <AvatarFallback>Guest</AvatarFallback>
</Avatar>
```

### Button

A versatile button component with multiple variants and states.

```typescript
import { Button } from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic button
<Button>Click me</Button>

// Variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Menu</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// As child component
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>

// With icon
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Save
</Button>
```

### Breadcrumb

Navigation breadcrumb component for showing current page location.

```typescript
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
```

#### Usage Examples

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Card

A flexible card component for displaying content in containers.

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

#### Usage Examples

```typescript
// Complete card structure
<Card>
  <CardHeader>
    <CardTitle>Dashboard Overview</CardTitle>
    <CardDescription>View your application statistics</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>Users: 1,234</div>
      <div>Revenue: £45,678</div>
    </div>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Simple card
<Card>
  <CardContent className="p-6">
    <h3>Quick Stats</h3>
    <p>Application performance metrics</p>
  </CardContent>
</Card>

// Interactive card
<Card className="cursor-pointer hover:shadow-lg transition-shadow">
  <CardContent className="p-4">
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="/avatar.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <h4>John Doe</h4>
        <p>Software Engineer</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Collapsible

A collapsible content area component.

```typescript
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
```

#### Usage Examples

```typescript
<Collapsible>
  <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
    <span>Show Details</span>
    <ChevronDown className="h-4 w-4" />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="p-4 border-t">
      <p>This content can be collapsed and expanded.</p>
    </div>
  </CollapsibleContent>
</Collapsible>
```

### Dropdown Menu

A dropdown menu component built on Radix UI primitives.

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
```

#### Usage Examples

```typescript
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Form Components

#### Input

A form input component with validation states.

```typescript
import { Input } from '@/components/ui/input';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic input
<Input placeholder="Enter your name" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// Controlled input
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>

// With validation error styling
<Input 
  type="email" 
  placeholder="Email address"
  className={errors.email ? "border-destructive" : ""}
/>
```

#### Label

A form label component.

```typescript
import { Label } from '@/components/ui/label';

// Usage
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

#### Form

Form components with React Hook Form integration.

```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Usage with React Hook Form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Enter your email" {...field} />
          </FormControl>
          <FormDescription>
            We'll never share your email.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Loading & State Components

#### Loading States

Advanced loading components with multiple patterns and skeleton states.

```typescript
import { 
  LoadingCard, 
  LoadingTable, 
  LoadingGrid, 
  LoadingList 
} from '@/components/ui/loading-states';

interface LoadingCardProps {
  className?: string;
  showImage?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}
```

#### Usage Examples

```typescript
// Card loading skeleton
<LoadingCard 
  showImage={true}
  showDescription={true}
  showActions={true}
/>

// Table loading skeleton
<LoadingTable 
  rows={5}
  columns={4}
  showHeader={true}
/>

// Grid loading skeleton
<LoadingGrid 
  items={6}
  columns={3}
  showImage={true}
/>

// List loading skeleton
<LoadingList 
  items={8}
  showAvatar={true}
  showMeta={true}
/>

// Conditional loading
{isLoading ? (
  <LoadingCard />
) : (
  <UserCard user={user} />
)}
```

#### Skeleton

Basic skeleton loading component.

```typescript
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonProps {
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic skeleton shapes
<Skeleton className="h-4 w-full" />
<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-32 w-full rounded-lg" />

// Combined skeleton layout
<div className="space-y-3">
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
  <Skeleton className="h-32 w-full" />
</div>
```

#### Empty State

Components for displaying empty or error states.

```typescript
import { EmptyState, ErrorState } from '@/components/ui/empty-state';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

interface ErrorStateProps {
  title: string;
  description?: string;
  error?: string;
  retry?: () => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// Empty state with action
<EmptyState
  icon={<Inbox className="h-12 w-12" />}
  title="No messages"
  description="You don't have any messages yet. Start a conversation!"
  action={{
    label: 'Compose Message',
    onClick: handleCompose,
  }}
/>

// Error state with retry
<ErrorState
  title="Failed to load data"
  description="Something went wrong while fetching your data."
  error="Network error: Connection timeout"
  retry={handleRetry}
/>

// Simple empty state
<EmptyState
  title="No results found"
  description="Try adjusting your search criteria"
/>
```

## Performance Components

### Virtualized List

High-performance list component for large datasets with virtualization.

```typescript
import { VirtualizedList } from '@/components/ui/virtualized-list';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  hasMore?: boolean;
  isLoading?: boolean;
}
```

#### Usage Examples

```typescript
// Basic virtualized list
<VirtualizedList
  items={largeDataset}
  itemHeight={60}
  containerHeight={400}
  renderItem={(item, index) => (
    <div key={index} className="p-4 border-b">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )}
/>

// With infinite scrolling
<VirtualizedList
  items={items}
  itemHeight={80}
  containerHeight={500}
  hasMore={hasMoreData}
  isLoading={isLoadingMore}
  onEndReached={loadMoreData}
  onEndReachedThreshold={0.8}
  renderItem={(item) => <ItemCard item={item} />}
/>
```

### Virtualized Grid

Grid component for displaying large datasets in a grid layout.

```typescript
import { VirtualizedGrid } from '@/components/ui/virtualized-list';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number, row: number, col: number) => React.ReactNode;
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth: number;
  overscan?: number;
  className?: string;
}
```

#### Usage Examples

```typescript
// Image grid
<VirtualizedGrid
  items={images}
  itemHeight={200}
  itemWidth={300}
  containerHeight={600}
  containerWidth={1200}
  renderItem={(image, index, row, col) => (
    <div key={index} className="p-2">
      <img 
        src={image.url} 
        alt={image.title}
        className="w-full h-full object-cover rounded"
      />
    </div>
  )}
/>
```

### Optimized Image

High-performance image component with lazy loading and optimization.

```typescript
import { OptimizedImage } from '@/components/ui/optimized-image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}
```

#### Usage Examples

```typescript
// Basic optimized image
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
/>

// With lazy loading and blur placeholder
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Responsive image
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>
```

## Layout & Navigation Components

### App Sidebar

Application sidebar with navigation and collapsible sections.

```typescript
import { AppSidebar } from '@/components/app-sidebar';
```

#### Usage Examples

```typescript
// In dashboard layout
<div className="flex h-screen">
  <AppSidebar />
  <main className="flex-1 overflow-auto">
    {children}
  </main>
</div>
```

### Navigation Components

#### NavMain

Main navigation component for primary navigation items.

```typescript
import { NavMain } from '@/components/nav-main';

// Used within sidebar
<NavMain items={navigationData.navMain} />
```

#### NavUser

User navigation component with profile and settings.

```typescript
import { NavUser } from '@/components/nav-user';

// User section in sidebar
<NavUser user={user} />
```

#### NavSecondary

Secondary navigation for additional links.

```typescript
import { NavSecondary } from '@/components/nav-secondary';

<NavSecondary items={secondaryNavItems} />
```

### Sidebar

Core sidebar component built on Radix UI primitives.

```typescript
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
```

#### Usage Examples

```typescript
<Sidebar>
  <SidebarHeader>
    <h2>App Name</h2>
  </SidebarHeader>
  <SidebarContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
  <SidebarFooter>
    <NavUser user={user} />
  </SidebarFooter>
</Sidebar>
```

### Sheet

Modal sheet component for overlays and side panels.

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
```

#### Usage Examples

```typescript
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>
        Sheet description goes here
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      <p>Sheet content</p>
    </div>
  </SheetContent>
</Sheet>
```

## Theme & UI Components

### Theme Toggle

A theme switching component with smooth transitions.

```typescript
import { ThemeToggle } from '@/components/custom/theme-toggle';

interface ThemeToggleProps {
  className?: string;
}
```

#### Usage Examples

```typescript
// In header
<ThemeToggle />

// With custom styling
<ThemeToggle className="ml-auto" />
```

### Theme Provider

Context provider for theme management.

```typescript
import { ThemeProvider } from '@/components/custom/theme-provider';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}
```

#### Usage Examples

```typescript
// In app layout
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

### Tooltip

Tooltip component for additional information.

```typescript
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
```

#### Usage Examples

```typescript
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>This is a tooltip</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Separator

A visual separator component.

```typescript
import { Separator } from '@/components/ui/separator';

// Usage
<div className="space-y-4">
  <div>Content above</div>
  <Separator />
  <div>Content below</div>
</div>
```

## Authentication & Form Components

### Login Form

A complete login form with React Hook Form and Zod validation.

```typescript
import { LoginForm } from '@/components/forms/login-form';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic usage
<LoginForm />

// With success callback
<LoginForm
  onSuccess={() => {
    toast.success('Login successful');
    router.push('/dashboard');
  }}
/>

// In modal or sheet
<Sheet>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sign In</SheetTitle>
    </SheetHeader>
    <LoginForm onSuccess={() => setIsOpen(false)} />
  </SheetContent>
</Sheet>
```

### Signup Form

A complete signup form with validation and terms acceptance.

```typescript
import { SignupForm } from '@/components/signup-form';

interface SignupFormProps {
  onSuccess?: () => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic usage
<SignupForm />

// With success callback
<SignupForm
  onSuccess={() => {
    toast.success('Account created successfully');
    router.push('/verify-email');
  }}
/>
```

### Search Form

Global search form component.

```typescript
import { SearchForm } from '@/components/search-form';

interface SearchFormProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// In header
<SearchForm 
  placeholder="Search anything..."
  onSearch={handleSearch}
/>
```

## Data Display Components

### Performance Dashboard

Real-time performance metrics dashboard.

```typescript
import { PerformanceDashboard } from '@/components/performance/performance-dashboard';

interface PerformanceDashboardProps {
  showRealTime?: boolean;
  className?: string;
}
```

#### Usage Examples

```typescript
// In admin panel
<PerformanceDashboard 
  showRealTime={true}
  className="grid gap-4"
/>

// Standalone widget
<Card>
  <CardHeader>
    <CardTitle>Performance Metrics</CardTitle>
  </CardHeader>
  <CardContent>
    <PerformanceDashboard />
  </CardContent>
</Card>
```

### Site Header

Application header with navigation and user controls.

```typescript
import { SiteHeader } from '@/components/site-header';

interface SiteHeaderProps {
  className?: string;
}
```

#### Usage Examples

```typescript
// In layout
<div className="min-h-screen">
  <SiteHeader />
  <main>{children}</main>
</div>
```

## SEO Components

### SEO Meta

Component for managing page metadata and SEO.

```typescript
import { SEOMeta } from '@/components/seo/seo-meta';

interface SEOMetaProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}
```

#### Usage Examples

```typescript
// In page components
<SEOMeta
  title="Dashboard - My App"
  description="Manage your account and view analytics"
  keywords={['dashboard', 'analytics', 'management']}
  image="/og-dashboard.jpg"
/>
```

### Structured Data

Components for adding structured data to pages.

```typescript
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/structured-data';

// Article schema
<ArticleSchema
  headline="How to Build Great UIs"
  description="A comprehensive guide to building user interfaces"
  datePublished="2024-01-15"
  author={{ name: 'John Doe' }}
/>

// Breadcrumb schema
<BreadcrumbSchema
  items={[
    { name: 'Home', url: '/' },
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Settings', url: '/dashboard/settings' },
  ]}
/>
```

## Performance Components

### Virtualized List

High-performance list component for large datasets.

```typescript
import { VirtualizedList } from '@/components/ui/virtualized-list';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic virtualized list
<VirtualizedList
  items={largeDataset}
  itemHeight={60}
  containerHeight={400}
  renderItem={(item, index) => (
    <div key={index} className="p-4 border-b">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )}
/>

// With overscan for smoother scrolling
<VirtualizedList
  items={items}
  itemHeight={50}
  containerHeight={300}
  overscan={5}
  renderItem={(item) => <ListItem item={item} />}
/>
```

### Virtualized Grid

Grid component for displaying large datasets in a grid layout.

```typescript
import { VirtualizedGrid } from '@/components/ui/virtualized-list';

interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}
```

#### Usage Examples

```typescript
// Image grid
<VirtualizedGrid
  items={images}
  itemHeight={200}
  itemWidth={300}
  containerHeight={600}
  containerWidth={1200}
  renderItem={(image) => (
    <div className="p-2">
      <img src={image.url} alt={image.title} />
    </div>
  )}
/>
```

### Optimized Image

High-performance image component with lazy loading and optimization.

```typescript
import { OptimizedImage } from '@/components/ui/optimized-image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic optimized image
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
/>

// With lazy loading
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
/>

// With fallback
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  fallbackSrc="/path/to/fallback.jpg"
  onError={() => console.log('Image failed to load')}
/>
```

## SEO Components

### SEO Meta

Component for managing page metadata and SEO.

```typescript
import { SEOMeta } from '@/components/seo/seo-meta';

interface SEOMetaProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}
```

#### Usage Examples

```typescript
// In page components
<SEOMeta
  title="Page Title"
  description="Page description for SEO"
  keywords={['keyword1', 'keyword2']}
  image="/og-image.jpg"
/>
```

### Structured Data

Components for adding structured data to pages.

```typescript
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/structured-data';

// Article schema
<ArticleSchema
  headline="Article Title"
  description="Article description"
  datePublished="2024-01-01"
  author={{ name: 'Author Name' }}
/>

// Breadcrumb schema
<BreadcrumbSchema
  items={[
    { name: 'Home', url: '/' },
    { name: 'Category', url: '/category' },
    { name: 'Current Page', url: '/category/page' },
  ]}
/>
```

## Component Best Practices

### 1. TypeScript Usage
- Always define prop interfaces with proper types
- Use strict typing for all props and state
- Provide default values where appropriate
- Use discriminated unions for complex props

### 2. Accessibility
- Include proper ARIA labels and roles
- Ensure keyboard navigation works correctly
- Provide screen reader support
- Test with accessibility tools

### 3. Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Use virtualization for large datasets

### 4. Styling
- Use Tailwind CSS classes consistently
- Follow design system tokens
- Ensure responsive design
- Maintain consistency across components

### 5. Error Handling
- Provide fallback states for errors
- Handle loading and error states gracefully
- Use error boundaries where needed
- Give meaningful error messages

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}

For more component patterns, refer to [ShadCN UI Documentation](https://ui.shadcn.com/) and [Radix UI Documentation](https://www.radix-ui.com/).

## Component Best Practices

### 1. TypeScript Usage

- Always define prop interfaces
- Use strict typing for all props
- Provide default values where appropriate
- Use discriminated unions for complex props

### 2. Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation
- Provide screen reader support
- Test with accessibility tools

### 3. Performance

- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Lazy load non-critical components

### 4. Styling

- Use Tailwind CSS classes
- Follow design system tokens
- Ensure responsive design
- Maintain consistency across components

### 5. Error Handling

- Provide fallback states
- Handle loading and error states
- Use error boundaries where needed
- Give meaningful error messages

## Component Testing

### Testing Examples

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Component Development

### Creating New Components

1. **Define the interface**:
```typescript
interface MyComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
  className?: string;
}
```

2. **Implement the component**:
```typescript
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onAction,
  className = '',
}) => {
  return (
    <div className={cn('my-component', className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {onAction && (
        <button onClick={onAction}>
          Action
        </button>
      )}
    </div>
  );
};
```

3. **Add tests**:
```typescript
describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

4. **Document the component**:
```typescript
/**
 * MyComponent - A component for displaying content with actions
 * 
 * @param title - The main title text
 * @param description - Optional description text
 * @param onAction - Optional callback for action button
 * @param className - Additional CSS classes
 */
```

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}
