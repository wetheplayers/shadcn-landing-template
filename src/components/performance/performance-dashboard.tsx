"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePerformanceMetrics } from '@/hooks/use-performance';

/**
 * Performance dashboard component
 * Displays real-time performance metrics and insights
 */
export function PerformanceDashboard(): React.ReactElement {
  const { metrics, isSupported } = usePerformanceMetrics();

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Performance monitoring is not supported in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatMetric = (value: number | null, unit: string = 'ms'): string => {
    if (value === null) return 'N/A';
    return `${value.toFixed(2)} ${unit}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">First Contentful Paint</CardTitle>
          <CardDescription>Time to first contentful paint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(metrics.fcp)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Largest Contentful Paint</CardTitle>
          <CardDescription>Time to largest contentful paint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(metrics.lcp)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">First Input Delay</CardTitle>
          <CardDescription>Time to first input response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(metrics.fid)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cumulative Layout Shift</CardTitle>
          <CardDescription>Visual stability metric</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(metrics.cls, '')}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Time to First Byte</CardTitle>
          <CardDescription>Server response time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(metrics.ttfb)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">First Meaningful Paint</CardTitle>
          <CardDescription>Time to meaningful content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMetric(metrics.fmp)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
