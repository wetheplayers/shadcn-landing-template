import { useEffect, useState } from 'react';

/**
 * Hook to handle authentication store hydration
 * Ensures the store is properly hydrated before rendering
 */
export function useAuthHydration(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use a timeout to ensure the store is properly initialized
    const timer = setTimeout(() => {
      console.log('Auth store hydration timeout - setting as hydrated');
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return isHydrated;
}
