import { ApiService } from './api.service';

import type { User } from '@/types';

/**
 * User Service
 * Handles authentication-related user operations
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
   * Update current user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await this.patch<User>('/me', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    preferences: Record<string, unknown>
  ): Promise<User | null> {
    try {
      const response = await this.patch<User>('/me/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return null;
    }
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      await this.post('/me/change-password', {
        currentPassword,
        newPassword,
      });
      return true;
    } catch (error) {
      console.error('Failed to change password:', error);
      return false;
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<boolean> {
    try {
      await this.post('/me/delete-account', { password });
      return true;
    } catch (error) {
      console.error('Failed to delete account:', error);
      return false;
    }
  }
}

export const userService = new UserService();
