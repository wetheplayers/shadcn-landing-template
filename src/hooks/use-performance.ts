"use client"

import { useState, useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fmp: number | null;
}

/**
 * Hook for tracking web performance metrics
 * Provides real-time performance monitoring using Performance Observer API
 */
export function usePerformanceMetrics(): {
  metrics: PerformanceMetrics;
  isSupported: boolean;
  resetMetrics: () => void;
} {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
  });
  const [isSupported, setIsSupported] = useState(false);
  const metricsRef = useRef<PerformanceMetrics>(metrics);

  // Check if Performance Observer is supported
  useEffect(() => {
    setIsSupported('PerformanceObserver' in window);
  }, []);

  // Update metrics ref when metrics change
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  const resetMetrics = useCallback(() => {
    setMetrics({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fmp: null,
    });
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const observers: PerformanceObserver[] = [];

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.entryType === 'first-contentful-paint');
        if (fcpEntry) {
          setMetrics((prev) => ({
            ...prev,
            fcp: fcpEntry.startTime,
          }));
        }
      });
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
      observers.push(fcpObserver);
    } catch (error) {
      console.warn('FCP observer not supported:', error);
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1]; // Get the latest LCP entry
        if (lcpEntry) {
          setMetrics((prev) => ({
            ...prev,
            lcp: lcpEntry.startTime,
          }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries.find((entry) => entry.entryType === 'first-input');
        if (fidEntry && 'processingStart' in fidEntry && 'startTime' in fidEntry) {
                  const processingStart = (fidEntry as PerformanceEntry & { processingStart?: number }).processingStart;
        const startTime = fidEntry.startTime;
        if (processingStart !== undefined) {
          setMetrics((prev) => ({
            ...prev,
            fid: processingStart - startTime,
          }));
        }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }

    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        for (const entry of entries) {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (entry.entryType === 'layout-shift' && layoutShiftEntry.hadRecentInput !== true && layoutShiftEntry.value !== undefined) {
            clsValue += layoutShiftEntry.value;
          }
        }
        
        setMetrics((prev) => ({
          ...prev,
          cls: clsValue,
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }

    // Time to First Byte (TTFB)
    try {
      const ttfbObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const navigationEntry = entries.find((entry) => entry.entryType === 'navigation');
        if (navigationEntry && 'responseStart' in navigationEntry && 'requestStart' in navigationEntry) {
                  const navigationEntryTyped = navigationEntry as PerformanceEntry & { responseStart?: number; requestStart?: number };
                const responseStart = navigationEntryTyped.responseStart;
        const requestStart = navigationEntryTyped.requestStart;
        if (responseStart !== undefined && requestStart !== undefined) {
          setMetrics((prev) => ({
            ...prev,
            ttfb: responseStart - requestStart,
          }));
        }
        }
      });
      ttfbObserver.observe({ entryTypes: ['navigation'] });
      observers.push(ttfbObserver);
    } catch (error) {
      console.warn('TTFB observer not supported:', error);
    }

    // First Meaningful Paint (FMP) - fallback calculation
    try {
      const fmpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const paintEntries = entries.filter((entry) => entry.entryType === 'paint');
        const fmpEntry = paintEntries.find((entry) => entry.name === 'first-meaningful-paint');
        if (fmpEntry) {
          setMetrics((prev) => ({
            ...prev,
            fmp: fmpEntry.startTime,
          }));
        }
      });
      fmpObserver.observe({ entryTypes: ['paint'] });
      observers.push(fmpObserver);
    } catch (error) {
      console.warn('FMP observer not supported:', error);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [isSupported]);

  return {
    metrics,
    isSupported,
    resetMetrics,
  };
}

/**
 * Hook for tracking API performance
 * Monitors fetch requests and provides performance insights
 */
export function useApiPerformance(): {
  trackApiCall: (url: string, startTime: number, endTime: number, success: boolean) => void;
  getApiMetrics: () => {
    averageResponseTime: number;
    totalRequests: number;
    successRate: number;
    slowestEndpoint: string | null;
  };
  resetApiMetrics: () => void;
} {
  const apiMetricsRef = useRef<{
    requests: Array<{
      url: string;
      duration: number;
      success: boolean;
      timestamp: number;
    }>;
  }>({ requests: [] });

  const trackApiCall = useCallback((
    url: string,
    startTime: number,
    endTime: number,
    success: boolean
  ) => {
    const duration = endTime - startTime;
    apiMetricsRef.current.requests.push({
      url,
      duration,
      success,
      timestamp: Date.now(),
    });

    // Keep only last 100 requests to prevent memory leaks
    if (apiMetricsRef.current.requests.length > 100) {
      apiMetricsRef.current.requests = apiMetricsRef.current.requests.slice(-100);
    }
  }, []);

  const getApiMetrics = useCallback(() => {
    const requests = apiMetricsRef.current.requests;
    if (requests.length === 0) {
      return {
        averageResponseTime: 0,
        totalRequests: 0,
        successRate: 0,
        slowestEndpoint: null,
      };
    }

    const totalDuration = requests.reduce((sum, req) => sum + req.duration, 0);
    const averageResponseTime = totalDuration / requests.length;
    const totalRequests = requests.length;
    const successfulRequests = requests.filter((req) => req.success).length;
    const successRate = (successfulRequests / totalRequests) * 100;

    const slowestRequest = requests.reduce((slowest, current) =>
      current.duration > slowest.duration ? current : slowest
    );

    return {
      averageResponseTime,
      totalRequests,
      successRate,
      slowestEndpoint: slowestRequest.url,
    };
  }, []);

  const resetApiMetrics = useCallback(() => {
    apiMetricsRef.current.requests = [];
  }, []);

  return {
    trackApiCall,
    getApiMetrics,
    resetApiMetrics,
  };
}

/**
 * Hook for monitoring memory usage
 * Tracks memory consumption and provides memory insights
 */
export function useMemoryMonitoring(): {
  memoryInfo: {
    usedJSHeapSize: number | null;
    totalJSHeapSize: number | null;
    jsHeapSizeLimit: number | null;
  };
  isSupported: boolean;
} {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number | null;
    totalJSHeapSize: number | null;
    jsHeapSizeLimit: number | null;
  }>({
    usedJSHeapSize: null,
    totalJSHeapSize: null,
    jsHeapSizeLimit: null,
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const hasMemoryAPI = 'memory' in performance;
    setIsSupported(hasMemoryAPI);

    if (hasMemoryAPI) {
      const updateMemoryInfo = () => {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        if (memory !== null && memory !== undefined) {
          setMemoryInfo({
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
          });
        }
      };

      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, []);

  return {
    memoryInfo,
    isSupported,
  };
}

/**
 * Hook for tracking user interactions
 * Monitors user engagement and interaction patterns
 */
export function useInteractionTracking(): {
  trackInteraction: (type: string, data?: Record<string, unknown>) => void;
  getInteractionMetrics: () => {
    totalInteractions: number;
    interactionTypes: Record<string, number>;
    averageTimeBetweenInteractions: number;
  };
  resetInteractionMetrics: () => void;
} {
  const interactionMetricsRef = useRef<{
    interactions: Array<{
      type: string;
      timestamp: number;
      data?: Record<string, unknown>;
    }>;
  }>({ interactions: [] });

  const trackInteraction = useCallback((
    type: string,
    data?: Record<string, unknown>
  ) => {
    interactionMetricsRef.current.interactions.push({
      type,
      timestamp: Date.now(),
      ...(data && { data }),
    });

    // Keep only last 1000 interactions
    if (interactionMetricsRef.current.interactions.length > 1000) {
      interactionMetricsRef.current.interactions = interactionMetricsRef.current.interactions.slice(-1000);
    }
  }, []);

  const getInteractionMetrics = useCallback(() => {
    const interactions = interactionMetricsRef.current.interactions;
    if (interactions.length === 0) {
      return {
        totalInteractions: 0,
        interactionTypes: {},
        averageTimeBetweenInteractions: 0,
      };
    }

    const totalInteractions = interactions.length;
    const interactionTypes: Record<string, number> = {};
    let totalTimeBetweenInteractions = 0;

    interactions.forEach((interaction, index) => {
      // Count interaction types
      interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;

      // Calculate time between interactions
              if (index > 0) {
          const previousInteraction = interactions[index - 1];
          if (previousInteraction !== null && previousInteraction !== undefined) {
            const timeDiff = interaction.timestamp - previousInteraction.timestamp;
            totalTimeBetweenInteractions += timeDiff;
          }
        }
    });

    const averageTimeBetweenInteractions = totalInteractions > 1 && totalTimeBetweenInteractions > 0 && (totalInteractions - 1) > 0 && Number.isFinite(totalTimeBetweenInteractions / (totalInteractions - 1)) ? totalTimeBetweenInteractions / (totalInteractions - 1) : 0;

    return {
      totalInteractions,
      interactionTypes,
      averageTimeBetweenInteractions,
    };
  }, []);

  const resetInteractionMetrics = useCallback(() => {
    interactionMetricsRef.current.interactions = [];
  }, []);

  return {
    trackInteraction,
    getInteractionMetrics,
    resetInteractionMetrics,
  };
}
