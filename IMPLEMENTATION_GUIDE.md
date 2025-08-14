# Implementation Guide

This document provides a comprehensive overview of all features, patterns, and best practices implemented in this Next.js application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript Configuration](#typescript-configuration)
3. [Testing](#testing)
4. [Error Handling](#error-handling)
5. [Environment Variables](#environment-variables)
6. [State Management](#state-management)
7. [Form Validation](#form-validation)
8. [Custom Hooks](#custom-hooks)
9. [UI Components](#ui-components)
10. [SEO & Metadata](#seo--metadata)
11. [API Services](#api-services)
12. [Docker Deployment](#docker-deployment)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── health/        # Health check endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Base UI components
│   │   ├── button.tsx     # Button component
│   │   ├── card.tsx       # Card component
│   │   ├── skeleton.tsx   # Skeleton loader
│   │   ├── loading.tsx    # Loading states
│   │   └── empty-state.tsx # Empty/error states
│   ├── forms/             # Form components
│   │   └── login-form.tsx # Example form with validation
│   ├── seo/               # SEO components
│   └── error-boundary.tsx # Error boundary wrapper
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── env.ts            # Environment validation
│   ├── metadata.ts       # Metadata helpers
│   └── validations/      # Zod schemas
├── services/              # API service layer
├── stores/                # Zustand state stores
└── types/                 # TypeScript definitions
```

## TypeScript Configuration

### Strict Mode Settings

All TypeScript strict checks are enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type-Safe Patterns

```typescript
// Always define interfaces for props
interface ComponentProps {
  title: string;
  count?: number;
}

// Use proper return types
function calculate(a: number, b: number): number {
  return a + b;
}

// Handle null/undefined explicitly
const value = data?.property ?? defaultValue;
```

## Testing

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:ci       # CI mode
```

### Writing Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

## Error Handling

### Error Boundary

Wrap components with error boundaries:

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

### API Error Handling

```typescript
try {
  const data = await apiService.get('/endpoint');
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API error
  }
  // Handle other errors
}
```

## Environment Variables

### Configuration

Environment variables are validated using Zod in `src/lib/env.ts`:

```typescript
// Access validated env vars
import { env } from '@/lib/env';

const apiUrl = env.NEXT_PUBLIC_API_URL;
```

### Required Variables

Copy `.env.example` to `.env.local` and configure:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Your App Name"
```

## State Management

### Zustand Stores

```typescript
// Using auth store
import { useAuthStore } from '@/stores/auth.store';

function Component() {
  const { user, login, logout } = useAuthStore();
  
  // Use store state and actions
}
```

### UI Store

```typescript
// Using UI store for toasts
import { useToast } from '@/stores/ui.store';

function Component() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Operation completed!');
  };
}
```

## Form Validation

### Zod Schemas

Define schemas in `src/lib/validations/`:

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().positive(),
});
```

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(userSchema),
});
```

## Custom Hooks

### Available Hooks

- `useDebounce` - Debounce values
- `useLocalStorage` - Persist to localStorage
- `useMediaQuery` - Responsive design
- `useClickOutside` - Detect outside clicks
- `useIntersectionObserver` - Viewport detection
- `useApi` - API data fetching

### Usage Examples

```typescript
// Debounce search input
const debouncedSearch = useDebounce(searchTerm, 500);

// Persist user preferences
const [theme, setTheme] = useLocalStorage('theme', 'light');

// Responsive design
const isMobile = useIsMobile();
```

## UI Components

### Loading States

```typescript
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading';
import { Skeleton } from '@/components/ui/skeleton';

// Inline loading
<LoadingSpinner size="sm" />

// Full page loading
<LoadingOverlay message="Loading data..." />

// Skeleton loader
<Skeleton className="h-4 w-full" />
```

### Empty States

```typescript
import { EmptyState, ErrorState } from '@/components/ui/empty-state';

<EmptyState
  title="No data found"
  description="Start by creating your first item"
  action={{
    label: 'Create Item',
    onClick: handleCreate,
  }}
/>
```

## SEO & Metadata

### Next.js 13+ Metadata

```typescript
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Page Title',
  description: 'Page description',
  keywords: ['keyword1', 'keyword2'],
});
```

### Structured Data

```typescript
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/structured-data';

<ArticleSchema
  headline="Article Title"
  description="Article description"
  datePublished="2024-01-01"
  author={{ name: 'Author Name' }}
/>
```

## API Services

### Using API Service

```typescript
import { apiService } from '@/services/api.service';

// Set auth token
apiService.setAuthToken(token);

// Make requests
const data = await apiService.get('/users');
const user = await apiService.post('/users', userData);
```

### User Service Example

```typescript
import { userService } from '@/services/user.service';

const currentUser = await userService.getCurrentUser();
const users = await userService.getUsers();
```

## Docker Deployment

### Development

```bash
# Build and run development container
docker-compose -f docker-compose.yml up app

# Or use development Dockerfile
docker build -f Dockerfile.dev -t app-dev .
docker run -p 3000:3000 -v $(pwd):/app app-dev
```

### Production

```bash
# Build production image
docker build -t shadcn-app .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 shadcn-app
```

### Health Check

The application includes a health check endpoint at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

## Best Practices

### Code Quality

1. **TypeScript**: No `any` types, strict mode enabled
2. **Testing**: Minimum 70% coverage
3. **Linting**: ESLint with strict rules
4. **Formatting**: Prettier configuration

### Performance

1. **Lazy Loading**: Use dynamic imports
2. **Memoization**: Use React.memo and useMemo
3. **Image Optimization**: Next.js Image component
4. **Bundle Size**: Analyze with `npm run build`

### Security

1. **Environment Variables**: Validated with Zod
2. **Input Validation**: All forms use Zod schemas
3. **Error Boundaries**: Catch and handle errors
4. **Security Headers**: Configured in next.config.ts

### Accessibility

1. **Semantic HTML**: Proper element usage
2. **ARIA Labels**: For interactive elements
3. **Keyboard Navigation**: Full support
4. **Screen Readers**: Tested compatibility

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   - Run `npm run type-check` to identify issues
   - Check `tsconfig.json` for strict settings

2. **Test Failures**
   - Clear cache: `npm run clean`
   - Update snapshots: `npm test -- -u`

3. **Docker Issues**
   - Rebuild: `docker-compose build --no-cache`
   - Check logs: `docker-compose logs app`

4. **Environment Variables**
   - Check `.env.local` exists
   - Validate with `npm run validate`

## Scripts Reference

```json
{
  "dev": "Start development server",
  "build": "Build for production",
  "start": "Start production server",
  "test": "Run tests",
  "test:watch": "Run tests in watch mode",
  "test:coverage": "Generate coverage report",
  "lint": "Run ESLint",
  "lint:fix": "Fix ESLint issues",
  "type-check": "Check TypeScript types",
  "validate": "Run all checks",
  "clean": "Clean build artifacts"
}
```

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

For more detailed information, see the documentation in the `/src/docs` directory.
