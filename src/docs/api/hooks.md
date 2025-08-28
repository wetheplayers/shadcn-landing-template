# Hooks Reference

This document provides comprehensive documentation for all custom React hooks in the application.

## Hook Categories

### 🔄 State Management Hooks
Hooks for managing component state and data persistence.

### 🌐 API and Data Hooks
Hooks for data fetching, caching, and API interactions.

### 🎯 Performance Hooks
Hooks for optimizing performance and managing expensive operations.

### 🎨 UI and Interaction Hooks
Hooks for handling user interactions and UI state.

## State Management Hooks

### useLocalStorage

Persist state to localStorage with automatic serialization.

```typescript
import { useLocalStorage } from '@/hooks/use-local-storage';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void];
```

#### Usage Examples

```typescript
// Basic usage
const [theme, setTheme] = useLocalStorage('theme', 'light');

// With objects
const [user, setUser] = useLocalStorage('user', {
  name: '',
  email: '',
  preferences: {},
});

// With functions
const [count, setCount] = useLocalStorage('count', 0);
setCount(prev => prev + 1);

// With custom serialization
const [data, setData] = useLocalStorage('data', null, {
  serializer: JSON.stringify,
  deserializer: JSON.parse,
});
```

#### Parameters

- `key: string` - The localStorage key
- `initialValue: T` - Initial value if no stored value exists
- `options?: LocalStorageOptions` - Optional configuration

#### Returns

- `[T, (value: T | ((prev: T) => T)) => void]` - Current value and setter function

### useSessionStorage

Similar to useLocalStorage but uses sessionStorage instead.

```typescript
import { useSessionStorage } from '@/hooks/use-session-storage';

function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void];
```

## API and Data Hooks

### useApi

Fetch data from APIs with loading, error, and caching states.

```typescript
import { useApi } from '@/hooks/use-api';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

function useApi<T>(
  url: string,
  options?: UseApiOptions<T>
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
```

#### Usage Examples

```typescript
// Basic usage
const { data, loading, error } = useApi<User[]>('/api/users');

// With options
const { data, loading, error, refetch } = useApi<User[]>('/api/users', {
  immediate: true,
  onSuccess: (data) => console.log('Users loaded:', data),
  onError: (error) => console.error('Failed to load users:', error),
  cacheTime: 5 * 60 * 1000, // 5 minutes
});

// Manual fetch
const { data, loading, error, refetch } = useApi<User[]>('/api/users', {
  immediate: false,
});

// Trigger fetch manually
useEffect(() => {
  refetch();
}, []);
```

#### Parameters

- `url: string` - API endpoint URL
- `options?: UseApiOptions<T>` - Configuration options

#### Returns

- `data: T | null` - Fetched data
- `loading: boolean` - Loading state
- `error: string | null` - Error message
- `refetch: () => Promise<void>` - Function to refetch data

### useMutation

Execute API mutations (POST, PUT, DELETE) with loading and error states.

```typescript
import { useMutation } from '@/hooks/use-mutation';

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
  onSettled?: () => void;
}

function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TVariables>
): {
  mutate: (variables: TVariables) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: TData | null;
};
```

#### Usage Examples

```typescript
// Create user mutation
const createUser = useMutation<User, CreateUserData>(
  async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    return response.json();
  },
  {
    onSuccess: (user) => {
      console.log('User created:', user);
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error}`);
    },
  }
);

// Use in component
const handleSubmit = async (userData: CreateUserData) => {
  await createUser.mutate(userData);
};
```

## Performance Hooks

### useDebounce

Debounce values to reduce the frequency of expensive operations.

```typescript
import { useDebounce } from '@/hooks/use-debounce';

function useDebounce<T>(value: T, delay: number): T;
```

#### Usage Examples

```typescript
// Debounce search input
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Use debounced value for API calls
useEffect(() => {
  if (debouncedSearchTerm) {
    searchUsers(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);

// Debounce window resize
const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});
const debouncedWindowSize = useDebounce(windowSize, 100);
```

### useThrottle

Throttle function calls to limit execution frequency.

```typescript
import { useThrottle } from '@/hooks/use-throttle';

function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T;
```

#### Usage Examples

```typescript
// Throttle scroll handler
const handleScroll = useThrottle((event) => {
  console.log('Scroll position:', event.target.scrollTop);
}, 100);

// Throttle resize handler
const handleResize = useThrottle(() => {
  setWindowSize({
    width: window.innerWidth,
    height: window.innerHeight,
  });
}, 250);
```

### useMemoizedValue

Memoize expensive calculations with custom equality functions.

```typescript
import { useMemoizedValue } from '@/hooks/use-memoized-value';

function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList,
  equalityFn?: (prev: T, next: T) => boolean
): T;
```

#### Usage Examples

```typescript
// Memoize expensive calculation
const expensiveValue = useMemoizedValue(
  () => {
    return heavyComputation(data);
  },
  [data],
  (prev, next) => {
    // Custom equality check
    return JSON.stringify(prev) === JSON.stringify(next);
  }
);

// Memoize filtered data
const filteredUsers = useMemoizedValue(
  () => users.filter(user => user.active),
  [users],
  (prev, next) => prev.length === next.length
);
```

### useVirtualization

Virtualize large lists for performance optimization.

```typescript
import { useVirtualization } from '@/hooks/use-virtualization';

interface UseVirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

function useVirtualization<T>(
  items: T[],
  options: UseVirtualizationOptions
): {
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
    data: T;
  }>;
  totalSize: number;
  containerRef: React.RefObject<HTMLDivElement>;
};
```

#### Usage Examples

```typescript
// Virtualize large list
const { virtualItems, totalSize, containerRef } = useVirtualization(
  largeDataset,
  {
    itemHeight: 50,
    containerHeight: 400,
    overscan: 5,
  }
);

return (
  <div ref={containerRef} className="overflow-auto h-96">
    <div style={{ height: totalSize, position: 'relative' }}>
      {virtualItems.map((virtualItem) => (
        <div
          key={virtualItem.index}
          style={{
            position: 'absolute',
            top: virtualItem.start,
            height: virtualItem.size,
            width: '100%',
          }}
        >
          {virtualItem.data.content}
        </div>
      ))}
    </div>
  </div>
);
```

## UI and Interaction Hooks

### useClickOutside

Detect clicks outside of a specified element.

```typescript
import { useClickOutside } from '@/hooks/use-click-outside';

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
): void;
```

#### Usage Examples

```typescript
// Close dropdown on outside click
const dropdownRef = useRef<HTMLDivElement>(null);
const [isOpen, setIsOpen] = useState(false);

useClickOutside(dropdownRef, () => {
  setIsOpen(false);
});

// Close modal on outside click
const modalRef = useRef<HTMLDivElement>(null);

useClickOutside(modalRef, () => {
  onClose();
});
```

### useIntersectionObserver

Observe element visibility in the viewport.

```typescript
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: UseIntersectionObserverOptions
): boolean;
```

#### Usage Examples

```typescript
// Lazy load images
const imageRef = useRef<HTMLImageElement>(null);
const isVisible = useIntersectionObserver(imageRef, {
  threshold: 0.1,
});

useEffect(() => {
  if (isVisible && imageRef.current) {
    imageRef.current.src = imageRef.current.dataset.src || '';
  }
}, [isVisible]);

// Infinite scroll
const sentinelRef = useRef<HTMLDivElement>(null);
const isVisible = useIntersectionObserver(sentinelRef);

useEffect(() => {
  if (isVisible && hasMore) {
    loadMore();
  }
}, [isVisible, hasMore]);
```

### useMediaQuery

Respond to media query changes.

```typescript
import { useMediaQuery } from '@/hooks/use-media-query';

function useMediaQuery(query: string): boolean;
```

#### Usage Examples

```typescript
// Responsive design
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');

// Dark mode preference
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

// Reduced motion preference
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

// Conditional rendering
return (
  <div>
    {isMobile && <MobileMenu />}
    {isDesktop && <DesktopMenu />}
  </div>
);
```

### useKeyPress

Listen for keyboard events.

```typescript
import { useKeyPress } from '@/hooks/use-key-press';

function useKeyPress(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options?: {
    target?: EventTarget;
    event?: 'keydown' | 'keyup';
  }
): void;
```

#### Usage Examples

```typescript
// Single key
useKeyPress('Escape', () => {
  setIsOpen(false);
});

// Multiple keys
useKeyPress(['Enter', 'Space'], (event) => {
  event.preventDefault();
  handleAction();
});

// With options
useKeyPress('s', (event) => {
  if (event.ctrlKey) {
    event.preventDefault();
    saveDocument();
  }
}, {
  event: 'keydown',
  target: document,
});
```

### useHover

Track hover state of an element.

```typescript
import { useHover } from '@/hooks/use-hover';

function useHover<T extends HTMLElement>(): [
  React.RefObject<T>,
  boolean
];
```

#### Usage Examples

```typescript
// Basic hover tracking
const [hoverRef, isHovered] = useHover<HTMLDivElement>();

return (
  <div ref={hoverRef} className={isHovered ? 'hovered' : ''}>
    Hover me
  </div>
);

// Tooltip on hover
const [tooltipRef, isHovered] = useHover<HTMLButtonElement>();

return (
  <div className="relative">
    <button ref={tooltipRef}>Button</button>
    {isHovered && (
      <div className="absolute top-full left-0 bg-black text-white p-2 rounded">
        Tooltip content
      </div>
    )}
  </div>
);
```

## Advanced Hooks

### useCancellableOperation

Manage cancellable async operations.

```typescript
import { useCancellableOperation } from '@/hooks/use-cancellable-operation';

function useCancellableOperation(): {
  execute: <T>(operation: (signal: AbortSignal) => Promise<T>) => Promise<T | null>;
  cancel: () => void;
};
```

#### Usage Examples

```typescript
// Cancellable API call
const { execute, cancel } = useCancellableOperation();

const fetchData = async () => {
  const result = await execute(async (signal) => {
    const response = await fetch('/api/data', { signal });
    return response.json();
  });
  
  if (result) {
    setData(result);
  }
};

// Cancel on unmount
useEffect(() => {
  return () => cancel();
}, [cancel]);
```

### useBatchedState

Batch multiple state updates to prevent unnecessary re-renders.

```typescript
import { useBatchedState } from '@/hooks/use-batched-state';

function useBatchedState<T>(
  initialState: T
): [T, (updater: T | ((prev: T) => T)) => void];
```

#### Usage Examples

```typescript
// Batch multiple updates
const [state, setState] = useBatchedState({
  count: 0,
  name: '',
  email: '',
});

const handleMultipleUpdates = () => {
  setState(prev => ({ ...prev, count: prev.count + 1 }));
  setState(prev => ({ ...prev, name: 'John' }));
  setState(prev => ({ ...prev, email: 'john@example.com' }));
  // Only one re-render will occur
};
```

## Hook Best Practices

### 1. TypeScript Usage

- Always define proper types for hook parameters and return values
- Use generic types for flexible hooks
- Provide default values where appropriate
- Use discriminated unions for complex state

### 2. Performance Optimization

- Use useCallback for stable function references
- Use useMemo for expensive calculations
- Implement proper cleanup in useEffect
- Avoid unnecessary re-renders

### 3. Error Handling

- Handle errors gracefully in async hooks
- Provide meaningful error messages
- Implement retry mechanisms where appropriate
- Use error boundaries for critical errors

### 4. Testing

- Test hooks in isolation using renderHook
- Mock external dependencies
- Test error scenarios
- Verify cleanup behavior

### 5. Documentation

- Document all parameters and return values
- Provide usage examples
- Explain edge cases and limitations
- Include TypeScript interfaces

## Hook Testing

### Testing Examples

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

## Creating Custom Hooks

### Hook Template

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseCustomHookReturn {
  data: any | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook description
 * 
 * @param options - Configuration options
 * @returns Hook return value description
 */
export const useCustomHook = (
  options: UseCustomHookOptions = {}
): UseCustomHookReturn => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!options.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await someAsyncOperation();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
```

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}
