import { env } from '@/lib/env';
import { logApiError } from '@/services/error.service';

import type { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Partial<User> {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

/**
 * Authentication service for handling user authentication
 * Provides login, registration, token management, and session handling
 */
export class AuthService {
  private static instance: AuthService;
  private readonly baseUrl: string;

  private constructor() {
    this.baseUrl = env.NEXT_PUBLIC_API_URL || '/api/auth';
  }

  static getInstance(): AuthService {
    if (AuthService.instance === undefined) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In development, provide demo authentication
      if (process.env.NODE_ENV === 'development') {
        return this.handleDemoLogin(credentials);
      }

      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json() as AuthResponse;
      return data;
    } catch (error) {
      logApiError(error instanceof Error ? error : new Error('Login failed'), `${this.baseUrl}/login`, 'POST');
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      const data = await response.json() as AuthResponse;
      return data;
    } catch (error) {
      logApiError(error instanceof Error ? error : new Error('Registration failed'), `${this.baseUrl}/register`, 'POST');
      throw error;
    }
  }

  /**
   * Validate current session and get user data
   */
  async validateSession(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Session validation failed');
      }

      const user = await response.json() as User;
      return user;
    } catch (error) {
      logApiError(error instanceof Error ? error : new Error('Session validation failed'), `${this.baseUrl}/me`, 'GET');
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json() as RefreshResponse;
      return data;
    } catch (error) {
      logApiError(error instanceof Error ? error : new Error('Token refresh failed'), `${this.baseUrl}/refresh`, 'POST');
      throw error;
    }
  }

  /**
   * Logout user and invalidate session
   */
  async logout(token: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Don't throw on logout failure - user should still be logged out locally
      logApiError(error instanceof Error ? error : new Error('Logout failed'), `${this.baseUrl}/logout`, 'POST');
    }
  }

  /**
   * Handle demo authentication for development
   */
  private async handleDemoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      const demoUser: User = {
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: '/avatars/demo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        user: demoUser,
        token: 'demo-jwt-token-123',
        refreshToken: 'demo-refresh-token-123',
      };
    }

    throw new Error('Invalid credentials. Use demo@example.com / demo123');
  }

  /**
   * Validate token format (basic validation)
   */
  static isValidToken(token: string): boolean {
    return token.length > 0 && token !== 'null' && token !== 'undefined';
  }

  /**
   * Parse JWT token payload (for basic validation)
   */
  static parseToken(token: string): { exp?: number; iat?: number } | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded = JSON.parse(atob(payload));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    // Demo tokens never expire
    if (token === 'demo-jwt-token-123') {
      return false;
    }
    
    const payload = AuthService.parseToken(token);
    if (!payload?.exp || payload.exp === 0) return true;
    
    return Date.now() >= payload.exp * 1000;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
