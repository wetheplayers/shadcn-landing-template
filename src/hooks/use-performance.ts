import { useCallback } from 'react';

interface PerformanceMetrics {
  url: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  timestamp: Date;
}

interface UseApiPerformanceReturn {
  trackApiCall: (
    url: string,
    startTime: number,
    endTime: number,
    success: boolean
  ) => void;
  getMetrics: () => PerformanceMetrics[];
  clearMetrics: () => void;
}

/**
 * Custom hook for tracking API performance metrics
 * Provides performance monitoring for API calls with timing and success tracking
 * 
 * @returns Object containing tracking functions and metrics
 */
export function useApiPerformance(): UseApiPerformanceReturn {
  const trackApiCall = useCallback((
    url: string,
    startTime: number,
    endTime: number,
    success: boolean
  ): void => {
    const duration = endTime - startTime;
    const metric: PerformanceMetrics = {
      url,
      startTime,
      endTime,
      duration,
      success,
      timestamp: new Date(),
    };

    // Store in localStorage for persistence across sessions
    try {
      const existingMetrics = localStorage.getItem('api-performance-metrics');
      const metrics: PerformanceMetrics[] = existingMetrics 
        ? (JSON.parse(existingMetrics) as PerformanceMetrics[]) 
        : [];
      
      // Keep only last 100 metrics to prevent storage bloat
      metrics.push(metric);
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100);
      }
      
      localStorage.setItem('api-performance-metrics', JSON.stringify(metrics));
    } catch (error) {
      // Silently fail if localStorage is not available
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to store performance metrics:', error);
      }
    }

    // Log slow API calls in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`Slow API call detected: ${url} took ${duration.toFixed(2)}ms`);
    }

    // Send performance metrics to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics service
      // analytics.track('api_performance', {
      //   url,
      //   duration,
      //   success,
      //   timestamp: new Date().toISOString(),
      // });
    }
  }, []);

  const getMetrics = useCallback((): PerformanceMetrics[] => {
    try {
      const existingMetrics = localStorage.getItem('api-performance-metrics');
      return existingMetrics ? (JSON.parse(existingMetrics) as PerformanceMetrics[]) : [];
    } catch {
      return [];
    }
  }, []);

  const clearMetrics = useCallback((): void => {
    try {
      localStorage.removeItem('api-performance-metrics');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to clear performance metrics:', error);
      }
    }
  }, []);

  return {
    trackApiCall,
    getMetrics,
    clearMetrics,
  };
}
