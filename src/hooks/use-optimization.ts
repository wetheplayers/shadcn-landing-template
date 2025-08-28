"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizationResult {
  virtualItems: VirtualItem[];
  totalSize: number;
  startIndex: number;
  endIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface IntersectionObserverResult {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  intersectionRatio: number;
  entry: IntersectionObserverEntry | null;
}

interface DebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

interface ThrottleOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Virtualization hook for performance optimization
 * Calculates which items should be rendered based on scroll position
 */
export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
): VirtualizationResult {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSize = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems: VirtualItem[] = useMemo(() => {
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
      container.addEventListener('scroll', handleScroll as unknown as EventListener);
      return () => {
        container.removeEventListener('scroll', handleScroll as unknown as EventListener);
      };
    }
    return undefined;
  }, [handleScroll]);

  return {
    virtualItems,
    totalSize,
    startIndex,
    endIndex,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
  };
}

/**
 * Advanced intersection observer hook
 * Provides detailed intersection information for performance optimization
 */
export function useIntersectionObserverAdvanced(
  options: IntersectionObserverOptions = {}
): IntersectionObserverResult {
  const { threshold = 0, rootMargin = '0px', root = null } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [firstEntry] = entries;
        if (firstEntry) {
          setIsIntersecting(firstEntry.isIntersecting);
          setIntersectionRatio(firstEntry.intersectionRatio);
          setEntry(firstEntry);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, root]);

  return {
    ref: ref as React.RefObject<Element>,
    isIntersecting,
    intersectionRatio,
    entry,
  };
}

/**
 * Debounce hook for performance optimization
 * Delays function execution until after a specified delay
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  options: Omit<DebounceOptions, 'delay'> = {}
): T {
  const { leading = false, trailing = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      if (leading && !timeoutRef.current) {
        callback(...args);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (trailing && lastArgsRef.current) {
          callback(...lastArgsRef.current);
        }
        timeoutRef.current = undefined;
        lastArgsRef.current = undefined;
      }, delay);
    },
    [callback, delay, leading, trailing]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}

/**
 * Throttle hook for performance optimization
 * Limits function execution to a maximum frequency
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  options: Omit<ThrottleOptions, 'delay'> = {}
): T {
  const { leading = true, trailing = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const lastCallTimeRef = useRef(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (timeSinceLastCall >= delay) {
        if (leading) {
          callback(...args);
          lastCallTimeRef.current = now;
        }
      } else {
        lastArgsRef.current = args;

        if (trailing && !timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (lastArgsRef.current) {
              callback(...lastArgsRef.current);
              lastCallTimeRef.current = Date.now();
            }
            timeoutRef.current = undefined;
            lastArgsRef.current = undefined;
          }, delay - timeSinceLastCall);
        }
      }
    },
    [callback, delay, leading, trailing]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback as T;
}

/**
 * Memoization hook for expensive calculations
 * Caches results based on dependencies
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(() => factory(), deps);
}

/**
 * Abortable fetch hook for API calls
 * Automatically cancels requests when component unmounts or dependencies change
 */
export function useAbortableFetch<T>(
  url: string,
  options: RequestInit = {}
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as T;
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Batch state updates hook for performance optimization
 * Batches multiple state updates into a single render cycle
 */
export function useBatchState<T>(
  initialState: T
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const batchRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const batchSetState = useCallback((updater: T | ((prev: T) => T)) => {
    const newValue = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater;
    batchRef.current.push(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (batchRef.current.length > 0) {
        const lastValue = batchRef.current[batchRef.current.length - 1];
        if (lastValue !== null && lastValue !== undefined) {
          setState(lastValue);
        }
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

  return [state, batchSetState];
}
