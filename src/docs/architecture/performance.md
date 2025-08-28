# Performance Optimization Guide

This document outlines the comprehensive performance optimization features implemented in the application and provides best practices for maintaining high performance.

## Table of Contents

1. [Core Web Vitals Monitoring](#core-web-vitals-monitoring)
2. [Virtualization](#virtualization)
3. [Image Optimization](#image-optimization)
4. [Advanced Hooks](#advanced-hooks)
5. [Bundle Analysis](#bundle-analysis)
6. [Performance Dashboard](#performance-dashboard)
7. [Best Practices](#best-practices)
8. [Performance Budgets](#performance-budgets)

## Core Web Vitals Monitoring

### Overview
The application includes comprehensive Core Web Vitals monitoring using the `usePerformance` hook.

### Metrics Tracked
- **First Contentful Paint (FCP)**: Time to first contentful paint
- **Largest Contentful Paint (LCP)**: Time to largest contentful paint
- **First Input Delay (FID)**: Time to first input response
- **Cumulative Layout Shift (CLS)**: Visual stability metric
- **Time to First Byte (TTFB)**: Server response time

### Usage

```typescript
import { usePerformance } from '@/hooks/use-performance';

function MyComponent() {
  const metrics = usePerformance({
    onMetrics: (metrics) => {
      console.log('Performance metrics:', metrics);
    },
    reportToAnalytics: true,
  });

  return (
    <div>
      <p>FCP: {metrics.fcp}ms</p>
      <p>LCP: {metrics.lcp}ms</p>
      <p>FID: {metrics.fid}ms</p>
      <p>CLS: {metrics.cls}</p>
      <p>TTFB: {metrics.ttfb}ms</p>
    </div>
  );
}
```

### Performance Thresholds
- **FCP**: Good ≤ 1800ms, Poor > 3000ms
- **LCP**: Good ≤ 2500ms, Poor > 4000ms
- **FID**: Good ≤ 100ms, Poor > 300ms
- **CLS**: Good ≤ 0.1, Poor > 0.25
- **TTFB**: Good ≤ 800ms, Poor > 1800ms

## Virtualization

### VirtualizedList Component
For handling large datasets efficiently:

```typescript
import { VirtualizedList } from '@/components/ui/virtualized-list';

function LargeDataList({ items }) {
  return (
    <VirtualizedList
      items={items}
      itemHeight={60}
      containerHeight={400}
      overscan={5}
      renderItem={(item, index) => (
        <div key={index} className="p-4 border-b">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      )}
    />
  );
}
```

### VirtualizedGrid Component
For grid layouts with large datasets:

```typescript
import { VirtualizedGrid } from '@/components/ui/virtualized-list';

function LargeDataGrid({ items }) {
  return (
    <VirtualizedGrid
      items={items}
      itemHeight={200}
      itemWidth={300}
      containerHeight={600}
      containerWidth={1200}
      renderItem={(item, index) => (
        <div key={index} className="p-4 border rounded">
          <img src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
        </div>
      )}
    />
  );
}
```

### InfiniteScroll Component
For infinite scrolling with performance optimizations:

```typescript
import { InfiniteScroll } from '@/components/ui/virtualized-list';

function InfiniteDataList({ items, hasMore, isLoading, onLoadMore }) {
  return (
    <InfiniteScroll
      items={items}
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={onLoadMore}
      threshold={100}
      renderItem={(item, index) => (
        <div key={index} className="p-4 border-b">
          {item.content}
        </div>
      )}
      renderLoading={() => (
        <div className="p-4 text-center">
          <LoadingSpinner />
        </div>
      )}
    />
  );
}
```

## Image Optimization

### OptimizedImage Component
High-performance image component with lazy loading:

```typescript
import { OptimizedImage } from '@/components/ui/optimized-image';

function MyImageComponent() {
  return (
    <OptimizedImage
      src="/path/to/image.jpg"
      alt="Description"
      width={400}
      height={300}
      priority={false}
      quality={75}
      placeholder="blur"
      fallbackSrc="/path/to/fallback.jpg"
      onLoad={() => console.log('Image loaded')}
      onError={() => console.log('Image failed to load')}
    />
  );
}
```

### ProgressiveImage Component
For progressive image loading:

```typescript
import { ProgressiveImage } from '@/components/ui/optimized-image';

function ProgressiveImageComponent() {
  return (
    <ProgressiveImage
      src="/path/to/high-quality.jpg"
      lowQualitySrc="/path/to/low-quality.jpg"
      alt="Description"
      width={400}
      height={300}
      onLoad={() => console.log('High quality image loaded')}
    />
  );
}
```

### ResponsiveImage Component
For responsive images with automatic sizing:

```typescript
import { ResponsiveImage } from '@/components/ui/optimized-image';

function ResponsiveImageComponent() {
  return (
    <ResponsiveImage
      src="/path/to/image.jpg"
      alt="Description"
      aspectRatio={16 / 9}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

## Advanced Hooks

### useVirtualization Hook
For custom virtualization logic:

```typescript
import { useVirtualization } from '@/hooks/use-optimization';

function CustomVirtualizedList({ items }) {
  const {
    virtualItems,
    totalSize,
    startIndex,
    endIndex,
    containerRef,
  } = useVirtualization(items, {
    itemHeight: 50,
    containerHeight: 300,
    overscan: 5,
  });

  return (
    <div ref={containerRef} className="overflow-auto h-80">
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
            {items[virtualItem.index].content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### useDebounceAdvanced Hook
Advanced debouncing with leading/trailing options:

```typescript
import { useDebounceAdvanced } from '@/hooks/use-optimization';

function SearchComponent() {
  const debouncedSearch = useDebounceAdvanced(
    (query) => {
      // Perform search
      console.log('Searching for:', query);
    },
    { delay: 300, leading: false, trailing: true }
  );

  return (
    <input
      type="text"
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useThrottle Hook
For throttling function calls:

```typescript
import { useThrottle } from '@/hooks/use-optimization';

function ScrollComponent() {
  const throttledScroll = useThrottle(
    (scrollTop) => {
      // Handle scroll
      console.log('Scroll position:', scrollTop);
    },
    { limit: 100, leading: true, trailing: true }
  );

  return (
    <div onScroll={(e) => throttledScroll(e.currentTarget.scrollTop)}>
      {/* Content */}
    </div>
  );
}
```

### useMemoizedValue Hook
For expensive calculations with custom equality:

```typescript
import { useMemoizedValue } from '@/hooks/use-optimization';

function ExpensiveComponent({ data }) {
  const processedData = useMemoizedValue(
    () => {
      // Expensive processing
      return data.map(item => ({
        ...item,
        processed: heavyComputation(item),
      }));
    },
    [data],
    (prev, next) => {
      // Custom equality check
      return JSON.stringify(prev) === JSON.stringify(next);
    }
  );

  return <div>{/* Render processed data */}</div>;
}
```

### useCancellableOperation Hook
For managing cancellable async operations:

```typescript
import { useCancellableOperation } from '@/hooks/use-optimization';

function DataFetchingComponent() {
  const { execute, cancel } = useCancellableOperation();

  const fetchData = async () => {
    const result = await execute(async (signal) => {
      const response = await fetch('/api/data', { signal });
      return response.json();
    });
    
    if (result) {
      console.log('Data fetched:', result);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}
```

## Bundle Analysis

### Bundle Analysis Utilities
For analyzing and optimizing bundle size:

```typescript
import { analyzeBundle, generateCodeSplittingRecommendations } from '@/lib/bundle-analyzer';

// Analyze bundle
const bundleData = [
  {
    name: 'main',
    size: 1024 * 1024, // 1MB
    gzippedSize: 256 * 1024, // 256KB
    dependencies: ['react', 'react-dom'],
  },
];

const analysis = analyzeBundle(bundleData);
console.log('Bundle analysis:', analysis);

// Generate code splitting recommendations
const routes = ['/dashboard', '/profile', '/settings'];
const componentSizes = {
  '/dashboard': 50 * 1024, // 50KB
  '/profile': 100 * 1024, // 100KB
  '/settings': 30 * 1024, // 30KB
};

const recommendations = generateCodeSplittingRecommendations(routes, componentSizes);
console.log('Recommendations:', recommendations);
```

### Performance Budget Checking
For enforcing performance budgets:

```typescript
import { checkPerformanceBudget } from '@/lib/bundle-analyzer';

const budget = {
  maxBundleSize: 2 * 1024 * 1024, // 2MB
  maxGzippedSize: 500 * 1024, // 500KB
};

const result = checkPerformanceBudget(
  bundleSize,
  gzippedSize,
  budget
);

if (!result.withinBudget) {
  console.warn('Performance budget exceeded:', result.violations);
}
```

## Performance Dashboard

### PerformanceDashboard Component
Real-time performance monitoring dashboard:

```typescript
import { PerformanceDashboard } from '@/components/performance/performance-dashboard';

function AdminPanel() {
  return (
    <div className="p-6">
      <h1>Performance Monitoring</h1>
      <PerformanceDashboard
        showRealTime={true}
        className="mt-6"
      />
    </div>
  );
}
```

## Best Practices

### 1. Component Optimization
- Use `React.memo` for expensive components
- Implement proper dependency arrays in hooks
- Avoid inline object/function creation in render

```typescript
// Good
const MemoizedComponent = React.memo(ExpensiveComponent);

// Good
const memoizedCallback = useCallback(() => {
  // Expensive operation
}, [dependency]);

// Bad
<div style={{ color: 'red' }}> {/* Inline object */}

// Good
const styles = { color: 'red' };
<div style={styles}>
```

### 2. State Management
- Use `useBatchedState` for multiple state updates
- Implement proper state normalization
- Avoid unnecessary re-renders

```typescript
import { useBatchedState } from '@/hooks/use-optimization';

function OptimizedComponent() {
  const [state, setState] = useBatchedState(initialState);

  const handleMultipleUpdates = () => {
    setState(prev => ({ ...prev, a: 1 }));
    setState(prev => ({ ...prev, b: 2 }));
    setState(prev => ({ ...prev, c: 3 }));
    // Only one re-render will occur
  };
}
```

### 3. Image Optimization
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading for below-the-fold images
- Provide fallback images
- Use responsive images with proper sizes

### 4. Code Splitting
- Implement route-based code splitting
- Use dynamic imports for heavy components
- Lazy load non-critical features

```typescript
// Route-based splitting
const Dashboard = lazy(() => import('./Dashboard'));

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Feature-based splitting
const Analytics = lazy(() => import('./Analytics'));
```

### 5. API Optimization
- Implement request caching
- Use request deduplication
- Implement proper error handling
- Monitor API performance

```typescript
import { useApi } from '@/hooks/use-api';

function DataComponent() {
  const { data, loading, error, refetch } = useApi('/api/data', {
    immediate: true,
    onSuccess: (data) => console.log('Data loaded:', data),
    onError: (error) => console.error('Error:', error),
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Render data */}</div>;
}
```

## Performance Budgets

### Recommended Budgets
- **Initial Bundle Size**: ≤ 2MB
- **Gzipped Bundle Size**: ≤ 500KB
- **Time to Interactive**: ≤ 3.5s
- **First Contentful Paint**: ≤ 1.8s
- **Largest Contentful Paint**: ≤ 2.5s
- **Cumulative Layout Shift**: ≤ 0.1

### Monitoring Performance Budgets
```typescript
import { checkPerformanceBudget } from '@/lib/bundle-analyzer';

const budgets = {
  bundle: {
    maxBundleSize: 2 * 1024 * 1024,
    maxGzippedSize: 500 * 1024,
  },
  metrics: {
    maxFCP: 1800,
    maxLCP: 2500,
    maxFID: 100,
    maxCLS: 0.1,
  },
};

// Check bundle budget
const bundleResult = checkPerformanceBudget(
  bundleSize,
  gzippedSize,
  budgets.bundle
);

// Check metrics budget
const metricsResult = checkMetricsBudget(metrics, budgets.metrics);
```

## Conclusion

This performance optimization system provides comprehensive tools for monitoring, analyzing, and improving application performance. By following these best practices and utilizing the provided components and hooks, you can ensure your application maintains excellent performance across all devices and network conditions.

For additional optimization strategies, refer to:
- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance](https://react.dev/learn/render-and-commit)
