import { useEffect, useRef, type RefObject } from 'react';

/**
 * Click outside hook
 * Detects clicks outside of the specified element
 * 
 * @param handler - Function to call when click outside is detected
 * @param enabled - Whether the hook is enabled (default: true)
 * @returns Ref to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      
      // Do nothing if clicking ref's element or its descendants
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, enabled]);

  return ref;
}
