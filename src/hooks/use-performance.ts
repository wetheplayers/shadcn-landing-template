'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface UsePerformanceOptions {
  onMetrics?: (metrics: PerformanceMetrics) => void;
  reportToAnalytics?: boolean;
}

/**
 * Hook for monitoring Core Web Vitals and performance metrics
 */
export function usePerformance(options: UsePerformanceOptions = {}): PerformanceMetrics {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    const { onMetrics, reportToAnalytics = false } = options;

    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // Track First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        metricsRef.current.fcp = fcpEntry.startTime;
        onMetrics?.(metricsRef.current);
        
        if (reportToAnalytics) {
          reportMetric('FCP', fcpEntry.startTime);
        }
      }
    });

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metricsRef.current.lcp = lastEntry.startTime;
        onMetrics?.(metricsRef.current);
        
        if (reportToAnalytics) {
          reportMetric('LCP', lastEntry.startTime);
        }
      }
    });

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[0];
      if (fidEntry) {
        metricsRef.current.fid = fidEntry.processingStart - fidEntry.startTime;
        onMetrics?.(metricsRef.current);
        
        if (reportToAnalytics) {
          reportMetric('FID', metricsRef.current.fid);
        }
      }
    });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      metricsRef.current.cls = clsValue;
      onMetrics?.(metricsRef.current);
      
      if (reportToAnalytics) {
        reportMetric('CLS', clsValue);
      }
    });

    // Track Time to First Byte (TTFB)
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        onMetrics?.(metricsRef.current);
        
        if (reportToAnalytics) {
          reportMetric('TTFB', metricsRef.current.ttfb);
        }
      }
    } catch (error) {
      // getEntriesByType might not be available in all environments
      console.warn('TTFB tracking not available:', error);
    }

    // Start observing
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance observation failed:', error);
    }

    // Cleanup
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [options]);

  return metricsRef.current;
}

/**
 * Report performance metric to analytics service
 */
function reportMetric(name: string, value: number): void {
  // In a real application, you would send this to your analytics service
  // Example: Google Analytics, Vercel Analytics, etc.
  if (process.env.NODE_ENV === 'production') {
    console.log(`Performance Metric - ${name}:`, value);
    
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        page_location: window.location.href,
      });
    }
  }
}

/**
 * Hook for monitoring component render performance
 */
export function useRenderPerformance(componentName: string): void {
  const renderStartRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      
      if (renderTime > 16) { // Longer than one frame (16ms)
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  });
}

/**
 * Hook for monitoring API call performance
 */
export function useApiPerformance(): {
  trackApiCall: (url: string, startTime: number, endTime: number, success: boolean) => void;
} {
  const trackApiCall = (url: string, startTime: number, endTime: number, success: boolean): void => {
    const duration = endTime - startTime;
    
    if (duration > 1000) { // Longer than 1 second
      console.warn(`Slow API call to ${url}: ${duration.toFixed(2)}ms`);
    }
    
    if (process.env.NODE_ENV === 'production') {
      // Report to analytics
      console.log('API Performance:', {
        url,
        duration,
        success,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return { trackApiCall };
}
