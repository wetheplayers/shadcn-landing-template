# Testing Guide

This guide covers testing strategies, best practices, and examples for the Next.js application.

## Testing Philosophy

Our testing approach follows these principles:

- **Type Safety**: All tests are written in TypeScript with strict typing
- **Component Isolation**: Test components in isolation with proper mocking
- **User-Centric**: Focus on testing user interactions and outcomes
- **Performance**: Tests should be fast and reliable
- **Coverage**: Aim for meaningful coverage, not just percentage targets

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for integration tests
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation

## Test Structure

### File Organization
```
src/
├── components/
│   ├── __tests__/
│   │   └── component.test.tsx
│   └── component.tsx
├── hooks/
│   ├── __tests__/
│   │   └── hook.test.ts
│   └── hook.ts
└── services/
    ├── __tests__/
    │   └── service.test.ts
    └── service.ts
```

### Test File Naming
- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Service tests: `serviceName.test.ts`
- Utility tests: `utilityName.test.ts`

## Component Testing

### Basic Component Test
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

### Component with Props Interface
```typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from '@/components/custom/user-card';

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

describe('UserCard', () => {
  it('displays user information', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles missing user gracefully', () => {
    render(<UserCard user={null} />);
    
    expect(screen.getByText('No user data')).toBeInTheDocument();
  });
});
```

### Testing with Providers
```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/custom/theme-provider';
import { ThemeToggle } from '@/components/custom/theme-toggle';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  it('toggles theme when clicked', () => {
    renderWithTheme(<ThemeToggle />);
    
    const toggle = screen.getByRole('button');
    toggle.click();
    
    // Verify theme change (implementation specific)
    expect(document.documentElement).toHaveClass('dark');
  });
});
```

## Hook Testing

### Custom Hook Test
```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when it exists', () => {
    localStorage.setItem('test', 'stored-value');
    
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('updates stored value when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test')).toBe('new-value');
  });
});
```

### Async Hook Test
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '@/hooks/use-api';

// Mock fetch
global.fetch = jest.fn();

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toBeNull();
  });
});
```

## Service Testing

### API Service Test
```typescript
import { apiService } from '@/services/api.service';

// Mock fetch
global.fetch = jest.fn();

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('makes GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.get('/test');

      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        headers: expect.any(Object),
      });
      expect(result).toEqual(mockData);
    });

    it('handles non-OK responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(apiService.get('/test')).rejects.toThrow('HTTP 404');
    });
  });

  describe('post', () => {
    it('makes POST request with data', async () => {
      const postData = { name: 'Test' };
      const mockResponse = { id: 1, ...postData };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.post('/test', postData);

      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        headers: expect.any(Object),
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
```

## Integration Testing

### API Route Testing
```typescript
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/users/route';

describe('/api/users', () => {
  describe('GET', () => {
    it('returns users list', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await GET(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        users: expect.any(Array),
      });
    });
  });

  describe('POST', () => {
    it('creates new user', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const { req, res } = createMocks({
        method: 'POST',
        body: userData,
      });

      await POST(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        user: expect.objectContaining(userData),
      });
    });

    it('validates required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: { name: 'John' }, // Missing email
      });

      await POST(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Email is required',
      });
    });
  });
});
```

## Mocking Strategies

### Mocking External Dependencies
```typescript
// Mock external libraries
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
jest.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  },
}));
```

### Mocking Components
```typescript
// Mock child components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock complex components
jest.mock('@/components/custom/theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle</button>,
}));
```

## Test Utilities

### Custom Render Function
```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/custom/theme-provider';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark';
}

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { theme = 'light', ...renderOptions } = options;
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider defaultTheme={theme}>
      {children}
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };
```

### Test Data Factories
```typescript
// test-factories.ts
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockPost = (overrides?: Partial<Post>): Post => ({
  id: 'post-id',
  title: 'Test Post',
  content: 'Test content',
  authorId: 'test-id',
  publishedAt: new Date('2024-01-01'),
  ...overrides,
});
```

## Running Tests

### Available Scripts
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"
```

### Coverage Configuration
```json
{
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/index.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the behavior
- Keep tests focused and isolated

### 2. Assertions
- Test one thing per test case
- Use specific assertions over generic ones
- Test both positive and negative cases

### 3. Mocking
- Mock external dependencies, not internal logic
- Use realistic mock data
- Reset mocks between tests

### 4. Performance
- Keep tests fast and reliable
- Avoid testing implementation details
- Use proper cleanup in `afterEach`/`afterAll`

### 5. Accessibility
- Test accessibility features
- Use semantic queries when possible
- Test keyboard navigation

## Common Patterns

### Testing Form Submissions
```typescript
import userEvent from '@testing-library/user-event';

it('submits form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<ContactForm onSubmit={onSubmit} />);
  
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  });
});
```

### Testing Loading States
```typescript
it('shows loading state while fetching data', async () => {
  const { result } = renderHook(() => useApi('/api/data'));
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});
```

### Testing Error Boundaries
```typescript
it('renders fallback when component throws', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary fallback={<div>Error occurred</div>}>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText('Error occurred')).toBeInTheDocument();
});
```

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}
