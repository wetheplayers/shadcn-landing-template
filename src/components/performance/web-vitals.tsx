'use client';

import { useEffect } from 'react';

/**
 * Web Vitals monitoring component
 * Tracks Core Web Vitals and other performance metrics
 */
export function WebVitalsMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Import web-vitals dynamically to avoid bundle bloat
    const trackWebVitals = async () => {
      try {
        // Import web-vitals with proper typing
        const webVitals = await import('web-vitals');
        const { onCLS, onFCP, onLCP, onTTFB } = webVitals;
        
        // Track Cumulative Layout Shift (CLS)
        onCLS((metric) => {
          // eslint-disable-next-line no-console
          console.log('CLS:', metric);
          // Send to analytics service
          // analytics.track('web_vital', { name: 'CLS', value: metric.value });
        });

        // Track First Contentful Paint (FCP)
        onFCP((metric) => {
          // eslint-disable-next-line no-console
          console.log('FCP:', metric);
          // Send to analytics service
          // analytics.track('web_vital', { name: 'FCP', value: metric.value });
        });

        // Track Largest Contentful Paint (LCP)
        onLCP((metric) => {
          // eslint-disable-next-line no-console
          console.log('LCP:', metric);
          // Send to analytics service
          // analytics.track('web_vital', { name: 'LCP', value: metric.value });
        });

        // Track Time to First Byte (TTFB)
        onTTFB((metric) => {
          // eslint-disable-next-line no-console
          console.log('TTFB:', metric);
          // Send to analytics service
          // analytics.track('web_vital', { name: 'TTFB', value: metric.value });
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load web-vitals:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    void trackWebVitals();
  }, []);

  return null; // This component doesn't render anything
}
