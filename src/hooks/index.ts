/**
 * Custom React Hooks
 * Collection of reusable hooks for common functionality
 */

// API hooks
export { useApi, useApiMutation } from './use-api';

// Utility hooks
export { useDebounce } from './use-debounce';
export { useLocalStorage } from './use-local-storage';
export { useClickOutside } from './use-click-outside';
export { useIntersectionObserver, useLazyLoad } from './use-intersection-observer';

// Media query hooks
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  usePrefersDarkMode,
  usePrefersReducedMotion,
  useIsPortrait,
  useIsLandscape,
} from './use-media-query';

// Performance hooks
export { usePerformance, useRenderPerformance, useApiPerformance } from './use-performance';
