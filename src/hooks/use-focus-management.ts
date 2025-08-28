import { useCallback, useRef } from 'react';

/**
 * Hook for managing focus in components
 * Provides utilities for focus trapping, restoration, and management
 */
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement | null>(null);

  /**
   * Trap focus within a container element
   */
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement | undefined;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && firstElement && lastElement) {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus the first element
    if (firstElement !== undefined) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
   * Restore focus to the previously focused element
   */
  const restoreFocus = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
      focusRef.current = null;
    }
  }, []);

  /**
   * Save the currently focused element
   */
  const saveFocus = useCallback(() => {
    focusRef.current = document.activeElement as HTMLElement;
  }, []);

  /**
   * Focus the first focusable element in a container
   */
  const focusFirstElement = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement | undefined;
    if (firstElement !== undefined) {
      firstElement.focus();
    }
  }, []);

  /**
   * Focus the last focusable element in a container
   */
  const focusLastElement = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;
    if (lastElement !== undefined) {
      lastElement.focus();
    }
  }, []);

  return {
    trapFocus,
    restoreFocus,
    saveFocus,
    focusFirstElement,
    focusLastElement,
  };
}
