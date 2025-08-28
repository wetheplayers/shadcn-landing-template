import { renderHook, act } from '@testing-library/react';
import { usePerformanceMetrics, useApiPerformance, useMemoryMonitoring } from '../use-performance';

// Mock PerformanceObserver
const mockPerformanceObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

mockPerformanceObserver.mockImplementation(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
}));

// Mock performance.memory
const mockMemory = {
  usedJSHeapSize: 1000000,
  totalJSHeapSize: 2000000,
  jsHeapSizeLimit: 5000000,
};

describe('usePerformanceMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock global PerformanceObserver
    global.PerformanceObserver = mockPerformanceObserver as any;
    
    // Mock performance.memory
    Object.defineProperty(global.performance, 'memory', {
      value: mockMemory,
      writable: true,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    expect(result.current.metrics).toEqual({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fmp: null,
    });
    expect(result.current.isSupported).toBe(true);
  });

  it('should handle PerformanceObserver not supported', () => {
    // Mock PerformanceObserver not being available
    const originalPerformanceObserver = global.PerformanceObserver;
    delete (global as any).PerformanceObserver;

    const { result } = renderHook(() => usePerformanceMetrics());

    expect(result.current.isSupported).toBe(false);

    // Restore
    global.PerformanceObserver = originalPerformanceObserver;
  });

  it('should reset metrics', () => {
    const { result } = renderHook(() => usePerformanceMetrics());

    act(() => {
      result.current.resetMetrics();
    });

    expect(result.current.metrics).toEqual({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fmp: null,
    });
  });
});

describe('useApiPerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track API calls', () => {
    const { result } = renderHook(() => useApiPerformance());

    act(() => {
      result.current.trackApiCall('/api/test', 1000, 1500, true);
    });

    const metrics = result.current.getApiMetrics();
    expect(metrics.totalRequests).toBe(1);
    expect(metrics.averageResponseTime).toBe(500);
    expect(metrics.successRate).toBe(100);
    expect(metrics.slowestEndpoint).toBe('/api/test');
  });

  it('should handle multiple API calls', () => {
    const { result } = renderHook(() => useApiPerformance());

    act(() => {
      result.current.trackApiCall('/api/test1', 1000, 1200, true);
      result.current.trackApiCall('/api/test2', 2000, 2500, false);
    });

    const metrics = result.current.getApiMetrics();
    expect(metrics.totalRequests).toBe(2);
    expect(metrics.averageResponseTime).toBe(350);
    expect(metrics.successRate).toBe(50);
    expect(metrics.slowestEndpoint).toBe('/api/test2');
  });

  it('should reset API metrics', () => {
    const { result } = renderHook(() => useApiPerformance());

    act(() => {
      result.current.trackApiCall('/api/test', 1000, 1500, true);
      result.current.resetApiMetrics();
    });

    const metrics = result.current.getApiMetrics();
    expect(metrics.totalRequests).toBe(0);
    expect(metrics.averageResponseTime).toBe(0);
    expect(metrics.successRate).toBe(0);
    expect(metrics.slowestEndpoint).toBeNull();
  });
});

describe('useMemoryMonitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock performance.memory
    Object.defineProperty(global.performance, 'memory', {
      value: mockMemory,
      writable: true,
    });
  });

  it('should return memory information when supported', () => {
    const { result } = renderHook(() => useMemoryMonitoring());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.memoryInfo).toEqual({
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 5000000,
    });
  });

  it('should handle memory API not supported', () => {
    // Mock performance.memory not being available
    const originalMemory = (global.performance as any).memory;
    (global.performance as any).memory = undefined;

    const { result } = renderHook(() => useMemoryMonitoring());

    expect(result.current.isSupported).toBe(false);
    expect(result.current.memoryInfo).toEqual({
      usedJSHeapSize: null,
      totalJSHeapSize: null,
      jsHeapSizeLimit: null,
    });

    // Restore
    if (originalMemory) {
      (global.performance as any).memory = originalMemory;
    } else {
      delete (global.performance as any).memory;
    }
  });
});
