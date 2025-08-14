import { ApiService } from './api.service';

import type { User } from '@/types';

/**
 * User Service
 * Handles all user-related API operations
 */
class UserService extends ApiService {
  constructor() {
    super('/api/users');
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.get<User>('/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.get<User>(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get user ${id}:`, error);
      return null;
    }
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.get<User[]>('');
      return response.data;
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await this.post<User>('', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response = await this.patch<User>(`/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      return null;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.delete(`/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      return false;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    id: string,
    preferences: Record<string, unknown>
  ): Promise<User | null> {
    try {
      const response = await this.patch<User>(`/${id}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error(`Failed to update preferences for user ${id}:`, error);
      return null;
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(id: string, file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`/api/users/${id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      return data.avatarUrl;
    } catch (error) {
      console.error(`Failed to upload avatar for user ${id}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
