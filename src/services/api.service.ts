import { env } from '@/lib/env';
import { logApiError } from '@/services/error.service';

import type { ApiResponse } from '@/types';

/**
 * Base API Service class
 * Provides common functionality for all API services
 */
export class ApiService {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private headers: HeadersInit;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || env.NEXT_PUBLIC_API_URL || '/api';
    this.timeout = env.NEXT_PUBLIC_API_TIMEOUT;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.headers = {
      ...this.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Clear authorization header
   */
  clearAuthToken(): void {
    const { Authorization, ...rest } = this.headers as Record<string, string>;
    this.headers = rest;
  }

  /**
   * GET request
   */
  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'POST' };
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    return this.request<T>(url, options);
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'PUT' };
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    return this.request<T>(url, options);
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const options: RequestInit = { method: 'PATCH' };
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    return this.request<T>(url, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  /**
   * Make HTTP request with timeout and retry logic
   */
  private async request<T>(
    url: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const startTime = performance.now();

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();

      // Track performance
      this.trackPerformance(url, startTime, endTime, response.ok);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as ApiResponse<T>;
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      const endTime = performance.now();
      
      // Track performance for failed requests
      this.trackPerformance(url, startTime, endTime, false);
      
      // Retry logic for transient errors
      if (this.shouldRetry(error, retryCount)) {
        return this.request<T>(url, options, retryCount + 1);
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: unknown, retryCount: number): boolean {
    const maxRetries = 3;
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    
    if (retryCount >= maxRetries) {
      return false;
    }
    
    if (error instanceof Error) {
      // Retry on network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return true;
      }
      
      // Retry on specific HTTP status codes
      const statusMatch = error.message.match(/HTTP (\d+):/);
      if (statusMatch) {
        const status = parseInt(statusMatch[1] ?? '0', 10);
        return retryableStatuses.includes(status);
      }
    }
    
    return false;
  }

  /**
   * Track API call performance
   */
  private trackPerformance(url: string, startTime: number, endTime: number, _success: boolean): void {
    const duration = endTime - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      logApiError(`Slow API call to ${url}: ${duration.toFixed(2)}ms`, url, 'GET', undefined);
    }
    
    // In development, log performance
    if (process.env.NODE_ENV === 'development') {
      logApiError(`API Performance: ${url} took ${Math.round(duration)}ms`, url, 'GET', undefined);
    }
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics service
      // analytics.track('api_call', { url, duration, success });
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
