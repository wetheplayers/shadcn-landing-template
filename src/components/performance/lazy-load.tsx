'use client';

import { Suspense, lazy, type ComponentType } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Lazy loading wrapper component
 * Provides consistent loading states for lazy-loaded content
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback ?? <Skeleton className="h-32 w-full" />}>
      {children}
    </Suspense>
  );
}

/**
 * Higher-order component for lazy loading
 * Wraps a component with lazy loading and error boundary
 */
export function withLazyLoad<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(async () => 
    Promise.resolve({ default: Component })
  );

  return function LazyWrapper(props: T) {
    return (
      <LazyLoad fallback={fallback}>
        <LazyComponent {...props} />
      </LazyLoad>
    );
  };
}

/**
 * Hook for lazy loading with intersection observer
 */
export function useLazyLoad<T extends HTMLElement>(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return (element: T | null) => {
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    }, defaultOptions);

    observer.observe(element);
  };
}
