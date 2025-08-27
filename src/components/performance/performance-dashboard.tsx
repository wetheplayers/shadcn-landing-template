'use client';

import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePerformance } from '@/hooks/use-performance';
import { LoadingSpinner } from '@/components/ui/loading-states';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

interface PerformanceDashboardProps {
  showRealTime?: boolean;
  className?: string;
}

/**
 * Performance monitoring dashboard component
 */
export function PerformanceDashboard({
  showRealTime = true,
  className = '',
}: PerformanceDashboardProps): React.ReactElement {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  // Get performance metrics
  const performanceMetrics = usePerformance({
    onMetrics: setMetrics,
    reportToAnalytics: false,
  });

  // Update metrics when they change
  useEffect(() => {
    setMetrics(performanceMetrics);
  }, [performanceMetrics]);

  // Show dashboard after a delay to avoid initial render impact
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
        {showRealTime && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Real-time</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* First Contentful Paint */}
        <MetricCard
          title="First Contentful Paint"
          value={metrics.fcp}
          unit="ms"
          description="Time to first contentful paint"
          status={getMetricStatus(metrics.fcp, { good: 1800, poor: 3000 })}
        />

        {/* Largest Contentful Paint */}
        <MetricCard
          title="Largest Contentful Paint"
          value={metrics.lcp}
          unit="ms"
          description="Time to largest contentful paint"
          status={getMetricStatus(metrics.lcp, { good: 2500, poor: 4000 })}
        />

        {/* First Input Delay */}
        <MetricCard
          title="First Input Delay"
          value={metrics.fid}
          unit="ms"
          description="Time to first input response"
          status={getMetricStatus(metrics.fid, { good: 100, poor: 300 })}
        />

        {/* Cumulative Layout Shift */}
        <MetricCard
          title="Cumulative Layout Shift"
          value={metrics.cls}
          unit=""
          description="Visual stability metric"
          status={getMetricStatus(metrics.cls, { good: 0.1, poor: 0.25 })}
          formatValue={(value) => value?.toFixed(3) || 'N/A'}
        />

        {/* Time to First Byte */}
        <MetricCard
          title="Time to First Byte"
          value={metrics.ttfb}
          unit="ms"
          description="Server response time"
          status={getMetricStatus(metrics.ttfb, { good: 800, poor: 1800 })}
        />

        {/* Overall Performance Score */}
        <MetricCard
          title="Performance Score"
          value={calculatePerformanceScore(metrics)}
          unit="%"
          description="Overall performance rating"
          status={getScoreStatus(calculatePerformanceScore(metrics))}
          formatValue={(value) => value?.toFixed(0) || 'N/A'}
        />
      </div>

      {/* Performance Recommendations */}
      <PerformanceRecommendations metrics={metrics} />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | null;
  unit: string;
  description: string;
  status: 'good' | 'needs-improvement' | 'poor';
  formatValue?: (value: number | null) => string;
}

function MetricCard({
  title,
  value,
  unit,
  description,
  status,
  formatValue,
}: MetricCardProps): React.ReactElement {
  const statusColors = {
    good: 'text-green-600 bg-green-50 border-green-200',
    'needs-improvement': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    poor: 'text-red-600 bg-red-50 border-red-200',
  };

  const statusLabels = {
    good: 'Good',
    'needs-improvement': 'Needs Improvement',
    poor: 'Poor',
  };

  return (
    <Card className={`border-2 ${statusColors[status]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold">
            {formatValue ? formatValue(value) : value || 'N/A'}
          </span>
          {value !== null && <span className="text-lg">{unit}</span>}
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            status === 'good' ? 'bg-green-100 text-green-800' :
            status === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {statusLabels[status]}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface PerformanceRecommendationsProps {
  metrics: PerformanceMetrics;
}

function PerformanceRecommendations({ metrics }: PerformanceRecommendationsProps): React.ReactElement {
  const recommendations = generateRecommendations(metrics);

  if (recommendations.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center text-green-800">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-medium">Excellent performance!</p>
            <p className="text-sm">All metrics are within optimal ranges.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Recommendations</CardTitle>
        <CardDescription>
          Suggestions to improve your application performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function getMetricStatus(
  value: number | null,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value === null) return 'needs-improvement';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

function getScoreStatus(score: number): 'good' | 'needs-improvement' | 'poor' {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const scores = [];
  
  if (metrics.fcp !== null) {
    scores.push(calculateFcpScore(metrics.fcp));
  }
  if (metrics.lcp !== null) {
    scores.push(calculateLcpScore(metrics.lcp));
  }
  if (metrics.fid !== null) {
    scores.push(calculateFidScore(metrics.fid));
  }
  if (metrics.cls !== null) {
    scores.push(calculateClsScore(metrics.cls));
  }
  if (metrics.ttfb !== null) {
    scores.push(calculateTtfbScore(metrics.ttfb));
  }
  
  return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
}

function calculateFcpScore(fcp: number): number {
  if (fcp <= 1800) return 100;
  if (fcp <= 3000) return 50;
  return 0;
}

function calculateLcpScore(lcp: number): number {
  if (lcp <= 2500) return 100;
  if (lcp <= 4000) return 50;
  return 0;
}

function calculateFidScore(fid: number): number {
  if (fid <= 100) return 100;
  if (fid <= 300) return 50;
  return 0;
}

function calculateClsScore(cls: number): number {
  if (cls <= 0.1) return 100;
  if (cls <= 0.25) return 50;
  return 0;
}

function calculateTtfbScore(ttfb: number): number {
  if (ttfb <= 800) return 100;
  if (ttfb <= 1800) return 50;
  return 0;
}

function generateRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];
  
  if (metrics.fcp !== null && metrics.fcp > 3000) {
    recommendations.push('Optimize First Contentful Paint by reducing server response time and critical resources.');
  }
  
  if (metrics.lcp !== null && metrics.lcp > 4000) {
    recommendations.push('Improve Largest Contentful Paint by optimizing images and reducing render-blocking resources.');
  }
  
  if (metrics.fid !== null && metrics.fid > 300) {
    recommendations.push('Reduce First Input Delay by breaking up long tasks and optimizing JavaScript execution.');
  }
  
  if (metrics.cls !== null && metrics.cls > 0.25) {
    recommendations.push('Fix Cumulative Layout Shift by setting explicit dimensions for images and avoiding dynamic content insertion.');
  }
  
  if (metrics.ttfb !== null && metrics.ttfb > 1800) {
    recommendations.push('Improve Time to First Byte by optimizing server response time and reducing server-side processing.');
  }
  
  return recommendations;
}
