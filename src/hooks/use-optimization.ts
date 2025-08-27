'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

/**
 * Hook for virtualizing large lists to improve performance
 */
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
): {
  virtualItems: VirtualItem[];
  totalSize: number;
  startIndex: number;
  endIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
} {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalSize = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll as any);
      return () => container.removeEventListener('scroll', handleScroll as any);
    }
  }, [handleScroll]);

  return {
    virtualItems,
    totalSize,
    startIndex,
    endIndex,
    containerRef,
  };
}

interface DebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Advanced debounce hook with leading/trailing options
 */
export function useDebounceAdvanced<T extends (...args: any[]) => any>(
  callback: T,
  options: DebounceOptions
): T {
  const { delay, leading = false, trailing = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallTimeRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Execute immediately if leading and enough time has passed
      if (leading && timeSinceLastCall >= delay) {
        lastCallTimeRef.current = now;
        callback(...args);
        return;
      }

      // Set timeout for trailing execution
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          lastCallTimeRef.current = Date.now();
          callback(...args);
        }, delay);
      }
    }) as T,
    [callback, delay, leading, trailing]
  );
}

interface ThrottleOptions {
  limit: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Throttle hook for limiting function execution frequency
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  options: ThrottleOptions
): T {
  const { limit, leading = true, trailing = true } = options;
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastArgsRef = useRef<Parameters<T>>();

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      lastArgsRef.current = args;

      // Execute immediately if leading and enough time has passed
      if (leading && timeSinceLastCall >= limit) {
        lastCallTimeRef.current = now;
        callback(...args);
        return;
      }

      // Set timeout for trailing execution if not already set
      if (trailing && !timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            lastCallTimeRef.current = Date.now();
            callback(...lastArgsRef.current);
            timeoutRef.current = undefined;
          }
        }, limit - timeSinceLastCall);
      }
    }) as T,
    [callback, limit, leading, trailing]
  );
}

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Advanced intersection observer hook with performance optimizations
 */
export function useIntersectionObserverAdvanced(
  options: IntersectionObserverOptions = {}
): {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  intersectionRatio: number;
  entry: IntersectionObserverEntry | null;
} {
  const [state, setState] = useState({
    isIntersecting: false,
    intersectionRatio: 0,
    entry: null as IntersectionObserverEntry | null,
  });

  const ref = useRef<Element>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState({
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          entry,
        });
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return {
    ref,
    ...state,
  };
}

/**
 * Hook for optimizing expensive calculations with memoization
 */
export function useMemoizedValue<T>(
  factory: () => T,
  dependencies: React.DependencyList,
  equalityFn?: (prev: T, next: T) => boolean
): T {
  const prevValueRef = useRef<T>();
  const prevDepsRef = useRef<React.DependencyList>();

  return useMemo(() => {
    const newValue = factory();
    
    // Use custom equality function if provided
    if (equalityFn && prevValueRef.current !== undefined) {
      if (equalityFn(prevValueRef.current, newValue)) {
        return prevValueRef.current;
      }
    }
    
    prevValueRef.current = newValue;
    prevDepsRef.current = dependencies;
    
    return newValue;
  }, dependencies);
}

/**
 * Hook for managing expensive operations with cancellation
 */
export function useCancellableOperation<T>() {
  const abortControllerRef = useRef<AbortController>();

  const execute = useCallback(async (
    operation: (signal: AbortSignal) => Promise<T>
  ): Promise<T | null> => {
    // Cancel previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      return await operation(abortControllerRef.current.signal);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null; // Operation was cancelled
      }
      throw error;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { execute, cancel };
}

/**
 * Hook for optimizing re-renders with shallow comparison
 */
export function useShallowEqual<T>(value: T): T {
  const ref = useRef<T>(value);
  
  if (!Object.is(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
}

/**
 * Hook for batching state updates to reduce re-renders
 */
export function useBatchedState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const batchRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchedSetState = useCallback((updater: T | ((prev: T) => T)) => {
    batchRef.current.push(typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (batchRef.current.length > 0) {
        setState(batchRef.current[batchRef.current.length - 1]);
        batchRef.current = [];
      }
    }, 0);
  }, [state]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchedSetState] as const;
}
