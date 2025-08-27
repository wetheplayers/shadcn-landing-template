import { renderHook, act } from '@testing-library/react';

import {
  useVirtualization,
  useDebounceAdvanced,
  useThrottle,
  useIntersectionObserverAdvanced,
  useMemoizedValue,
  useCancellableOperation,
  useShallowEqual,
  useBatchedState,
} from '../use-optimization';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  
  global.IntersectionObserver = mockIntersectionObserver;
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: jest.fn(),
    disconnect: mockDisconnect,
  }));
});

describe('useVirtualization', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  it('initializes with correct virtual items', () => {
    const { result } = renderHook(() =>
      useVirtualization(mockItems, {
        itemHeight: 50,
        containerHeight: 300,
        overscan: 5,
      })
    );

    expect(result.current.virtualItems).toBeDefined();
    expect(result.current.totalSize).toBe(5000); // 100 * 50
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBeGreaterThan(0);
  });

  it('calculates correct virtual items based on scroll position', () => {
    const { result } = renderHook(() =>
      useVirtualization(mockItems, {
        itemHeight: 50,
        containerHeight: 300,
        overscan: 2,
      })
    );

    // Initial state should show first few items
    expect(result.current.virtualItems.length).toBeGreaterThan(0);
    expect(result.current.virtualItems[0]?.index).toBe(0);
  });
});

describe('useDebounceAdvanced', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces function calls with trailing option', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebounceAdvanced(callback, { delay: 100, trailing: true })
    );

    // Call multiple times
    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('executes immediately with leading option', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebounceAdvanced(callback, { delay: 100, leading: true })
    );

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throttles function calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottle(callback, { limit: 100 })
    );

    // Call multiple times
    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('useIntersectionObserverAdvanced', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useIntersectionObserverAdvanced());

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.intersectionRatio).toBe(0);
    expect(result.current.entry).toBeNull();
  });

  it('sets up intersection observer', () => {
    renderHook(() => useIntersectionObserverAdvanced());

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});

describe('useMemoizedValue', () => {
  it('memoizes values correctly', () => {
    const factory = jest.fn(() => ({ value: 'test' }));
    const { result, rerender } = renderHook(
      ({ deps }) => useMemoizedValue(factory, deps),
      { initialProps: { deps: [1] } }
    );

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual({ value: 'test' });

    // Rerender with same deps
    rerender({ deps: [1] });
    expect(factory).toHaveBeenCalledTimes(1); // Should not call again

    // Rerender with different deps
    rerender({ deps: [2] });
    expect(factory).toHaveBeenCalledTimes(2); // Should call again
  });

  it('uses custom equality function', () => {
    const factory = jest.fn(() => ({ value: 'test' }));
    const equalityFn = jest.fn(() => true); // Always return true (equal)

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoizedValue(factory, deps, equalityFn),
      { initialProps: { deps: [1] } }
    );

    expect(factory).toHaveBeenCalledTimes(1);

    // Rerender with different deps, but equality function returns true
    rerender({ deps: [2] });
    expect(factory).toHaveBeenCalledTimes(1); // Should not call again due to equality function
  });
});

describe('useCancellableOperation', () => {
  it('provides execute and cancel functions', () => {
    const { result } = renderHook(() => useCancellableOperation());

    expect(result.current.execute).toBeDefined();
    expect(result.current.cancel).toBeDefined();
    expect(typeof result.current.execute).toBe('function');
    expect(typeof result.current.cancel).toBe('function');
  });

  it('executes operation successfully', async () => {
    const { result } = renderHook(() => useCancellableOperation());
    const operation = jest.fn().mockResolvedValue('success');

    const promise = result.current.execute(operation);
    const response = await promise;

    expect(operation).toHaveBeenCalled();
    expect(response).toBe('success');
  });

  it('cancels previous operation when new one starts', async () => {
    const { result } = renderHook(() => useCancellableOperation());
    
    const slowOperation = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('slow'), 1000))
    );
    
    const fastOperation = jest.fn().mockResolvedValue('fast');

    // Start slow operation
    const slowPromise = result.current.execute(slowOperation);
    
    // Start fast operation (should cancel slow one)
    const fastPromise = result.current.execute(fastOperation);
    
    const fastResult = await fastPromise;
    const slowResult = await slowPromise;

    expect(fastResult).toBe('fast');
    expect(slowResult).toBeNull(); // Should be cancelled
  });
});

describe('useShallowEqual', () => {
  it('returns same reference for equal objects', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useShallowEqual(value),
      { initialProps: { value: { a: 1, b: 2 } } }
    );

    const firstResult = result.current;

    // Rerender with same object
    rerender({ value: { a: 1, b: 2 } });
    expect(result.current).toBe(firstResult); // Same reference

    // Rerender with different object
    rerender({ value: { a: 1, b: 3 } });
    expect(result.current).not.toBe(firstResult); // Different reference
  });
});

describe('useBatchedState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('batches multiple state updates', () => {
    const { result } = renderHook(() => useBatchedState(0));

    // Multiple updates
    act(() => {
      result.current[1](1);
      result.current[1](2);
      result.current[1](3);
    });

    // Should still be initial value (not yet batched)
    expect(result.current[0]).toBe(0);

    // Fast-forward to trigger batch
    act(() => {
      jest.advanceTimersByTime(0);
    });

    // Should be last value
    expect(result.current[0]).toBe(3);
  });

  it('handles function updates', () => {
    const { result } = renderHook(() => useBatchedState(0));

    act(() => {
      result.current[1](prev => prev + 1);
      result.current[1](prev => prev + 1);
      result.current[1](prev => prev + 1);
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current[0]).toBe(3);
  });
});
