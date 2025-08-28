/**
 * Hooks index file
 * Centralized exports for all custom hooks
 */

// API and data hooks
export { useApi } from './use-api';
export { useLocalStorage } from './use-local-storage';

// Performance hooks
export { 
  usePerformanceMetrics, 
  useApiPerformance, 
  useMemoryMonitoring,
  useInteractionTracking 
} from './use-performance';

// Optimization hooks
export {
  useVirtualization,
  useIntersectionObserverAdvanced,
  useDebounce,
  useThrottle,
  useMemoizedValue,
  useAbortableFetch,
  useBatchState,
} from './use-optimization';

// Utility hooks
export { useClickOutside } from './use-click-outside';
export { useDebounce as useDebounceSimple } from './use-debounce';
export { useIntersectionObserver } from './use-intersection-observer';
export { useMediaQuery } from './use-media-query';
