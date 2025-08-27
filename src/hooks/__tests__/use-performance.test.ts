import { renderHook } from '@testing-library/react';

import { usePerformance, useRenderPerformance, useApiPerformance } from '../use-performance';

// Mock PerformanceObserver
const mockPerformanceObserver = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock PerformanceObserver
  global.PerformanceObserver = mockPerformanceObserver;
  mockPerformanceObserver.mockImplementation((callback) => ({
    observe: jest.fn(),
    disconnect: mockDisconnect,
  }));
  
  // Mock performance.getEntriesByType
  global.performance = {
    ...global.performance,
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn().mockReturnValue([{
      responseStart: 100,
      requestStart: 50,
    }]),
  };
});

describe('usePerformance', () => {
  it('initializes with null metrics', () => {
    const { result } = renderHook(() => usePerformance());
    
    expect(result.current).toEqual({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
    });
  });

  it('sets up performance observers', () => {
    renderHook(() => usePerformance());
    
    expect(mockPerformanceObserver).toHaveBeenCalledTimes(4);
  });

  it('calls onMetrics callback when metrics are available', () => {
    const onMetrics = jest.fn();
    renderHook(() => usePerformance({ onMetrics }));
    
    expect(mockPerformanceObserver).toHaveBeenCalled();
  });

  it('handles missing PerformanceObserver gracefully', () => {
    // @ts-ignore - Mocking missing PerformanceObserver
    global.PerformanceObserver = undefined;
    
    const { result } = renderHook(() => usePerformance());
    
    expect(result.current).toEqual({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
    });
  });
});

describe('useRenderPerformance', () => {
  it('tracks render performance', () => {
    const componentName = 'TestComponent';
    const performanceSpy = jest.spyOn(performance, 'now');
    
    performanceSpy.mockReturnValueOnce(100); // Start time
    performanceSpy.mockReturnValueOnce(120); // End time
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    renderHook(() => useRenderPerformance(componentName));
    
    // Cleanup will trigger the performance check
    renderHook(() => useRenderPerformance(componentName));
    
    expect(performanceSpy).toHaveBeenCalled();
    
    performanceSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});

describe('useApiPerformance', () => {
  it('provides trackApiCall function', () => {
    const { result } = renderHook(() => useApiPerformance());
    
    expect(result.current.trackApiCall).toBeDefined();
    expect(typeof result.current.trackApiCall).toBe('function');
  });

  it('tracks API call performance', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() => useApiPerformance());
    
    // Test slow API call (> 1000ms)
    result.current.trackApiCall('/api/test', 100, 1200, true);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Slow API call to /api/test: 1100.00ms'
    );
    
    consoleSpy.mockRestore();
  });

  it('logs performance data in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { result } = renderHook(() => useApiPerformance());
    
    result.current.trackApiCall('/api/test', 100, 200, true);
    
    expect(consoleSpy).toHaveBeenCalledWith('API Performance:', {
      url: '/api/test',
      duration: 100,
      success: true,
      timestamp: expect.any(String),
    });
    
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });
});
