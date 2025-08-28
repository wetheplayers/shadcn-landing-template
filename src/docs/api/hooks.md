# Hooks Reference

This document provides comprehensive documentation for all custom React hooks in the Next.js application. All hooks are built with TypeScript, follow React best practices, and provide optimized performance.

## Hook Categories

### 🔄 State Management Hooks
Hooks for managing component state, data persistence, and browser storage.

### 🌐 API and Data Hooks
Hooks for data fetching, caching, API interactions, and performance monitoring.

### 🎯 Performance Hooks
Hooks for optimizing performance, virtualization, and managing expensive operations.

### 🎨 UI and Interaction Hooks
Hooks for handling user interactions, viewport detection, and responsive design.

### 📊 Utility Hooks
General purpose utility hooks for common development patterns.

## State Management Hooks

### useLocalStorage

Persist state to localStorage with automatic serialization and SSR support.

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
const [userPreferences, setUserPreferences] = useLocalStorage('user-prefs', {
  theme: 'system',
  language: 'en-GB',
  notifications: true,
});

// With functions
const [count, setCount] = useLocalStorage('count', 0);
setCount(prev => prev + 1);

// Array data
const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);

// Complex state
const [settings, setSettings] = useLocalStorage('app-settings', {
  sidebar: { collapsed: false, width: 240 },
  theme: { mode: 'system', accent: 'blue' },
  layout: { density: 'comfortable' },
});
```

#### Features

- **SSR Safe**: Handles hydration mismatch gracefully
- **Type Safe**: Full TypeScript support with generics
- **Automatic Serialization**: JSON serialization for complex objects
- **Error Handling**: Graceful fallback when localStorage is unavailable
- **Sync Across Tabs**: Updates when localStorage changes in other tabs

#### Parameters

- `key: string` - The localStorage key
- `initialValue: T` - Initial value if no stored value exists

#### Returns

- `[T, (value: T | ((prev: T) => T)) => void]` - Current value and setter function

## API and Data Hooks

### useApi

Fetch data from APIs with loading, error states, and performance monitoring.

```typescript
import { useApi } from '@/hooks/use-api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

function useApi<T>(
  url: string,
  options?: UseApiOptions
): UseApiResult<T>;
```

#### Usage Examples

```typescript
// Basic usage
const { data, loading, error } = useApi<User[]>('/api/users');

// Conditional rendering
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState title="No users found" />;

return <UserList users={data} />;

// With callbacks
const { data, loading, error, refetch } = useApi<User[]>('/api/users', {
  immediate: true,
  onSuccess: (data) => {
    console.log('Users loaded:', data);
    toast.success(`Loaded ${data.length} users`);
  },
  onError: (error) => {
    console.error('Failed to load users:', error);
    toast.error('Failed to load users');
  },
});

// Manual fetch control
const { data, loading, error, refetch } = useApi<User[]>('/api/users', {
  immediate: false, // Don't fetch on mount
});

// Trigger fetch manually
const handleLoadUsers = () => {
  refetch();
};

// Dependent queries
const userId = '123';
const { data: user } = useApi<User>(`/api/users/${userId}`);
const { data: posts } = useApi<Post[]>(
  `/api/users/${userId}/posts`,
  { immediate: !!user } // Only fetch when user is loaded
);

// Polling
const { data: metrics } = useApi<Metrics>('/api/metrics');

useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 30000); // Refresh every 30 seconds
  
  return () => clearInterval(interval);
}, [refetch]);
```

#### Features

- **Performance Monitoring**: Automatic API call tracking
- **Type Safety**: Full TypeScript support with generics
- **Error Handling**: Consistent error handling across the app
- **Loading States**: Built-in loading state management
- **Manual Control**: Option to control when data is fetched

#### Parameters

- `url: string` - API endpoint URL
- `options?: UseApiOptions` - Configuration options
  - `immediate?: boolean` - Fetch data immediately on mount (default: true)
  - `onSuccess?: (data: unknown) => void` - Success callback
  - `onError?: (error: string) => void` - Error callback

#### Returns

- `data: T | null` - Fetched data
- `loading: boolean` - Loading state
- `error: string | null` - Error message
- `refetch: () => Promise<void>` - Function to refetch data

## Performance Hooks

### usePerformanceMetrics

Track web performance metrics using the Performance Observer API.

```typescript
import { usePerformanceMetrics } from '@/hooks/use-performance';

interface PerformanceMetrics {
  fcp: number | null;      // First Contentful Paint
  lcp: number | null;      // Largest Contentful Paint
  fid: number | null;      // First Input Delay
  cls: number | null;      // Cumulative Layout Shift
  ttfb: number | null;     // Time to First Byte
  fmp: number | null;      // First Meaningful Paint
}

function usePerformanceMetrics(): {
  metrics: PerformanceMetrics;
  isSupported: boolean;
  resetMetrics: () => void;
};
```

#### Usage Examples

```typescript
// Basic usage
const { metrics, isSupported } = usePerformanceMetrics();

if (!isSupported) {
  return <div>Performance monitoring not supported</div>;
}

return (
  <div className="performance-metrics">
    <h3>Core Web Vitals</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A'}</div>
      <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A'}</div>
      <div>FID: {metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A'}</div>
      <div>CLS: {metrics.cls ? metrics.cls.toFixed(4) : 'N/A'}</div>
      <div>TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A'}</div>
    </div>
  </div>
);

// With performance dashboard
const { metrics, resetMetrics } = usePerformanceMetrics();

const handleResetMetrics = () => {
  resetMetrics();
  toast.success('Performance metrics reset');
};

// Monitoring and alerts
useEffect(() => {
  if (metrics.lcp && metrics.lcp > 2500) {
    console.warn('LCP is above recommended threshold');
  }
  if (metrics.cls && metrics.cls > 0.1) {
    console.warn('CLS is above recommended threshold');
  }
}, [metrics]);
```

### useApiPerformance

Track API call performance and timing.

```typescript
import { useApiPerformance } from '@/hooks/use-performance';

function useApiPerformance(): {
  trackApiCall: (url: string, duration: number, success: boolean) => void;
  getAverageResponseTime: () => number | null;
  getSuccessRate: () => number | null;
  clearStats: () => void;
};
```

#### Usage Examples

```typescript
// Track API performance
const { trackApiCall, getAverageResponseTime, getSuccessRate } = useApiPerformance();

const fetchData = async (url: string) => {
  const startTime = performance.now();
  let success = false;
  
  try {
    const response = await fetch(url);
    success = response.ok;
    return await response.json();
  } catch (error) {
    success = false;
    throw error;
  } finally {
    const duration = performance.now() - startTime;
    trackApiCall(url, duration, success);
  }
};

// Monitor API performance
const averageTime = getAverageResponseTime();
const successRate = getSuccessRate();

console.log(`Average API response time: ${averageTime}ms`);
console.log(`API success rate: ${(successRate * 100).toFixed(1)}%`);
```

### useMemoryMonitoring

Monitor memory usage and detect memory leaks.

```typescript
import { useMemoryMonitoring } from '@/hooks/use-performance';

function useMemoryMonitoring(): {
  memoryInfo: MemoryInfo | null;
  isSupported: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
};
```

#### Usage Examples

```typescript
// Monitor memory usage
const { memoryInfo, isSupported, startMonitoring, stopMonitoring } = useMemoryMonitoring();

useEffect(() => {
  startMonitoring();
  return () => stopMonitoring();
}, [startMonitoring, stopMonitoring]);

if (isSupported && memoryInfo) {
  const usedMB = (memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2);
  const totalMB = (memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2);
  
  return (
    <div>
      <p>Memory Usage: {usedMB} MB / {totalMB} MB</p>
    </div>
  );
}
```

## Optimization Hooks

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

// Debounce form validation
const [email, setEmail] = useState('');
const debouncedEmail = useDebounce(email, 300);

useEffect(() => {
  if (debouncedEmail) {
    validateEmail(debouncedEmail);
  }
}, [debouncedEmail]);

// Debounce window resize
const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});
const debouncedWindowSize = useDebounce(windowSize, 100);
```

### useVirtualization

Virtualize large lists for performance optimization.

```typescript
import { useVirtualization } from '@/hooks/use-optimization';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
): {
  virtualItems: VirtualItem[];
  totalSize: number;
  startIndex: number;
  endIndex: number;
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
          {largeDataset[virtualItem.index].content}
        </div>
      ))}
    </div>
  </div>
);
```

### useMemoizedValue

Memoize expensive calculations with custom equality functions.

```typescript
import { useMemoizedValue } from '@/hooks/use-optimization';

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
  () => users.filter(user => user.active && user.role === 'admin'),
  [users],
  (prev, next) => prev.length === next.length
);
```

### useAbortableFetch

Fetch data with automatic request cancellation.

```typescript
import { useAbortableFetch } from '@/hooks/use-optimization';

function useAbortableFetch<T>(
  url: string,
  options?: RequestInit
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  abort: () => void;
};
```

#### Usage Examples

```typescript
// Abortable fetch
const { data, loading, error, abort } = useAbortableFetch<User[]>('/api/users');

// Cancel request on component unmount or dependency change
useEffect(() => {
  return () => abort();
}, [abort]);

// Manual cancellation
const handleCancel = () => {
  abort();
  toast.info('Request cancelled');
};
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

function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
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

Respond to media query changes for responsive design.

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

### useMobile

Detect mobile devices with enhanced detection.

```typescript
import { useMobile } from '@/hooks/use-mobile';

function useMobile(): boolean;
```

#### Usage Examples

```typescript
// Enhanced mobile detection
const isMobile = useMobile();

// Conditional features
if (isMobile) {
  return <TouchOptimizedComponent />;
} else {
  return <DesktopOptimizedComponent />;
}

// Responsive navigation
const navigation = isMobile ? <MobileNav /> : <DesktopNav />;
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

## Hook Development Guidelines

### Creating Custom Hooks

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

## Testing Hooks

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

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}

For more advanced hook patterns, refer to the [React Hooks Documentation](https://react.dev/reference/react) and the [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks).

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
