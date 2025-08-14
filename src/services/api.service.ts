import { env } from '@/lib/env';

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
   * Make HTTP request with timeout
   */
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      
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
}

// Export singleton instance
export const apiService = new ApiService();
