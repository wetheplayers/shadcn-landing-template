import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  initialIsIntersecting?: boolean;
}

/**
 * Intersection Observer hook
 * Observes when an element enters or leaves the viewport
 * 
 * @param options - Intersection Observer options
 * @returns Tuple of [ref, isIntersecting, entry]
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean, IntersectionObserverEntry | undefined] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    initialIsIntersecting = false,
  } = options;

  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);

  // Track if we've frozen the observer
  const frozen = useRef(false);

  useEffect(() => {
    // Check browser support
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    // Skip if frozen
    if (frozen.current) return;

    const element = ref.current;
    if (!element) return;

    // Create observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry?.isIntersecting ?? false;
        
        setEntry(entry);
        setIsIntersecting(isElementIntersecting);

        // Freeze if visible and freezeOnceVisible is true
        if (isElementIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    // Start observing
    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [ref, isIntersecting, entry];
}

/**
 * Lazy load hook
 * Returns true when element is visible (useful for lazy loading)
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options?: Omit<UseIntersectionObserverOptions, 'freezeOnceVisible'>
): [RefObject<T | null>, boolean] {
  const [ref, isVisible] = useIntersectionObserver<T>({
    ...options,
    freezeOnceVisible: true,
  });

  return [ref, isVisible];
}
