"use client"

import { useState, useEffect, useCallback } from 'react';

import type { ApiResponse } from '@/types';
import { useApiPerformance } from './use-performance';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook for API data fetching with loading/error states
 * Provides consistent error handling and loading states across the application
 * 
 * @param url - The API endpoint URL
 * @param options - Configuration options for the hook
 * @returns Object containing data, loading state, error state, and refetch function
 */
export function useApi<T>(
  url: string, 
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { immediate = true, onSuccess, onError } = options;
  const { trackApiCall } = useApiPerformance();
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    const startTime = performance.now();
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as ApiResponse<T>;
      
      if (!result.success) {
        throw new Error(result.message || 'API request failed');
      }

      setData(result.data);
      onSuccess?.(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      // Log error for debugging (remove in production)
      console.error('API request failed:', err);
    } finally {
      setLoading(false);
      const endTime = performance.now();
      trackApiCall(url, startTime, endTime, error === null);
    }
  }, [url, onSuccess, onError, trackApiCall, error]);

  useEffect(() => {
    if (immediate) {
      void fetchData();
    }
  }, [fetchData, immediate]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData 
  };
}

/**
 * Enhanced hook for API mutations (POST, PUT, DELETE)
 * Provides mutation state management with proper error handling
 */
export function useApiMutation<T, TVariables = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
): {
  mutate: (variables: TVariables) => Promise<T | null>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as ApiResponse<T>;
        
        if (!result.success) {
          throw new Error(result.message || 'Mutation failed');
        }

        return result.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        // Log error for debugging (remove in production)
        console.error('API mutation failed:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return {
    mutate,
    loading,
    error,
  };
} 