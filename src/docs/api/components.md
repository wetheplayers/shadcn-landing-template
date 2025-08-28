# Component Library

This document provides comprehensive documentation for all UI components in the application.

## Component Categories

### 🎨 Base UI Components
Core components built on ShadCN/ui with strict TypeScript support.

### 🧩 Custom Components
Application-specific components that extend base functionality.

### 📝 Form Components
Form-related components with validation and accessibility features.

### 🎯 Performance Components
Optimized components for handling large datasets and performance-critical scenarios.

## Base UI Components

### Button

A versatile button component with multiple variants and states.

```typescript
import { Button } from '@/components/ui/button';

interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
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

// Loading state
<Button loading>Processing...</Button>

// With icon
<Button>
  <Icon className="mr-2" />
  Save
</Button>
```

### Card

A flexible card component for displaying content in containers.

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Simple card
<Card>
  <CardContent className="p-6">
    <h3>Simple Card</h3>
    <p>Content without header/footer</p>
  </CardContent>
</Card>
```

### Input

A form input component with validation states.

```typescript
import { Input } from '@/components/ui/input';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic input
<Input placeholder="Enter your name" />

// With validation
<Input 
  type="email" 
  placeholder="Email address"
  error={!!emailError}
/>

// Controlled input
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

### Loading States

Components for displaying loading states throughout the application.

#### LoadingSpinner

```typescript
import { LoadingSpinner } from '@/components/ui/loading';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### LoadingOverlay

```typescript
import { LoadingOverlay } from '@/components/ui/loading';

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}
```

#### Usage Examples

```typescript
// Inline spinner
<LoadingSpinner size="sm" />

// Full page overlay
<LoadingOverlay message="Loading data..." />

// In components
{isLoading ? <LoadingSpinner /> : <DataComponent />}
```

### Skeleton

Skeleton loading components for content placeholders.

```typescript
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonProps {
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic skeleton
<Skeleton className="h-4 w-full" />

// Card skeleton
<div className="space-y-3">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-[200px]" />
</div>

// Avatar skeleton
<Skeleton className="h-12 w-12 rounded-full" />
```

### Empty State

Components for displaying empty or error states.

```typescript
import { EmptyState, ErrorState } from '@/components/ui/empty-state';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

interface ErrorStateProps {
  title: string;
  description?: string;
  retry?: () => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// Empty state
<EmptyState
  title="No data found"
  description="Start by creating your first item"
  action={{
    label: 'Create Item',
    onClick: handleCreate,
  }}
/>

// Error state
<ErrorState
  title="Something went wrong"
  description="Failed to load data"
  retry={handleRetry}
/>
```

## Custom Components

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

### Error Boundary

Error boundary component for catching and handling React errors.

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode | ((error: Error) => React.ReactNode);
}
```

#### Usage Examples

```typescript
// With fallback component
<ErrorBoundary fallback={<ErrorComponent />}>
  <RiskyComponent />
</ErrorBoundary>

// With fallback function
<ErrorBoundary 
  fallback={(error) => (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  )}
>
  <RiskyComponent />
</ErrorBoundary>
```

## Form Components

### Login Form

A complete login form with validation and error handling.

```typescript
import { LoginForm } from '@/components/forms/login-form';

interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  className?: string;
}
```

#### Usage Examples

```typescript
// Basic usage
<LoginForm />

// With callbacks
<LoginForm
  onSuccess={(user) => {
    console.log('Logged in:', user);
    router.push('/dashboard');
  }}
  onError={(error) => {
    toast.error(error);
  }}
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
