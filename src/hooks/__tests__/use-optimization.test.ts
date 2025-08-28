import { renderHook, act } from '@testing-library/react';
import {
  useVirtualization,
  useIntersectionObserverAdvanced,
  useDebounce,
  useThrottle,
  useMemoizedValue,
  useAbortableFetch,
  useBatchState,
} from '../use-optimization';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

mockIntersectionObserver.mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useVirtualization', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate virtual items correctly', () => {
    const { result } = renderHook(() =>
      useVirtualization(mockItems, {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 5,
      })
    );

    expect(result.current.virtualItems).toBeDefined();
    expect(result.current.totalSize).toBe(5000); // 100 items * 50px
    expect(result.current.startIndex).toBeGreaterThanOrEqual(0);
    expect(result.current.endIndex).toBeLessThanOrEqual(99);
  });

  it('should handle empty items array', () => {
    const { result } = renderHook(() =>
      useVirtualization([], {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 5,
      })
    );

    expect(result.current.virtualItems).toEqual([]);
    expect(result.current.totalSize).toBe(0);
  });
});

describe('useIntersectionObserverAdvanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useIntersectionObserverAdvanced());

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.intersectionRatio).toBe(0);
    expect(result.current.entry).toBeNull();
    expect(result.current.ref).toBeDefined();
  });

  it('should set up intersection observer with custom options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      root: null,
    };

    const { result } = renderHook(() => useIntersectionObserverAdvanced(options));
    
    // Simulate having an element
    const mockElement = document.createElement('div');
    Object.defineProperty(result.current.ref, 'current', {
      value: mockElement,
      writable: true,
    });

    // Trigger the effect by changing the ref
    act(() => {
      result.current.ref.current = mockElement;
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });

  it('should handle intersection observer not supported', () => {
    const originalIntersectionObserver = global.IntersectionObserver;
    delete (global as any).IntersectionObserver;

    const { result } = renderHook(() => useIntersectionObserverAdvanced());

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.intersectionRatio).toBe(0);

    global.IntersectionObserver = originalIntersectionObserver;
  });
});

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));

    act(() => {
      result.current('test');
      result.current('test2');
      result.current('test3');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });

  it('should handle leading option', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 100, { leading: true }));

    act(() => {
      result.current('test');
    });

    expect(callback).toHaveBeenCalledWith('test');

    act(() => {
      result.current('test2');
    });

    expect(callback).toHaveBeenCalledTimes(1); // Only the leading call
  });
});

describe('useThrottle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throttle function calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 100));

    act(() => {
      result.current('test');
      result.current('test2');
      result.current('test3');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');

    act(() => {
      jest.advanceTimersByTime(100);
      result.current('test4');
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('test3');
  });
});

describe('useMemoizedValue', () => {
  it('should memoize values based on dependencies', () => {
    const factory = jest.fn(() => 'memoized value');
    const deps = [1, 2, 3];

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoizedValue(factory, deps),
      { initialProps: { deps } }
    );

    expect(result.current).toBe('memoized value');
    expect(factory).toHaveBeenCalledTimes(1);

    // Same dependencies, should not call factory again
    rerender({ deps });
    expect(factory).toHaveBeenCalledTimes(1);

    // Different dependencies, should call factory again
    rerender({ deps: [1, 2, 4] });
    expect(factory).toHaveBeenCalledTimes(2);
  });
});

describe('useAbortableFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    } as Response);
  });

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useAbortableFetch('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ data: 'test' });
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAbortableFetch('/api/test'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('should abort previous requests', async () => {
    const { rerender } = renderHook(
      ({ url }) => useAbortableFetch(url),
      { initialProps: { url: '/api/test1' } }
    );

    rerender({ url: '/api/test2' });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('useBatchState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should batch state updates', () => {
    const { result } = renderHook(() => useBatchState(0));

    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });

    // Should still be initial value before timeout
    expect(result.current[0]).toBe(0);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Should be the last value after timeout
    expect(result.current[0]).toBe(3);
  });

  it('should handle function updaters', () => {
    const { result } = renderHook(() => useBatchState(0));

    act(() => {
      result.current[1](prev => prev + 1);
      result.current[1](prev => prev + 1);
      result.current[1](prev => prev + 1);
    });

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current[0]).toBe(3);
  });
});
