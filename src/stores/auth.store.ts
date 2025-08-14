import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

interface AuthActions {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  
  // User management
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Token management
  setToken: (token: string | null) => void;
  clearToken: () => void;
  
  // Loading and error states
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Session management
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

/**
 * Authentication store
 * Manages user authentication state and actions
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,

        // Login action
        login: async (email: string, password: string) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              throw new Error('Invalid credentials');
            }

            const data = await response.json();
            
            set((state) => {
              state.user = data.user;
              state.token = data.token;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Login failed';
              state.isLoading = false;
            });
            throw error;
          }
        },

        // Logout action
        logout: () => {
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          });
        },

        // Register action
        register: async (userData) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            });

            if (!response.ok) {
              throw new Error('Registration failed');
            }

            const data = await response.json();
            
            set((state) => {
              state.user = data.user;
              state.token = data.token;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Registration failed';
              state.isLoading = false;
            });
            throw error;
          }
        },

        // Set user
        setUser: (user) => {
          set((state) => {
            state.user = user;
            state.isAuthenticated = user !== null;
          });
        },

        // Update user
        updateUser: (updates) => {
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          });
        },

        // Token management
        setToken: (token) => {
          set((state) => {
            state.token = token;
          });
        },

        clearToken: () => {
          set((state) => {
            state.token = null;
          });
        },

        // Loading state
        setLoading: (isLoading) => {
          set((state) => {
            state.isLoading = isLoading;
          });
        },

        // Error management
        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        // Check authentication status
        checkAuth: async () => {
          const token = get().token;
          if (!token) {
            get().logout();
            return;
          }

          set((state) => {
            state.isLoading = true;
          });

          try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Session expired');
            }

            const user = await response.json();
            
            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (error) {
            get().logout();
            set((state) => {
              state.isLoading = false;
            });
          }
        },

        // Refresh token
        refreshToken: async () => {
          const token = get().token;
          if (!token) return;

          try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Token refresh failed');
            }

            const data = await response.json();
            
            set((state) => {
              state.token = data.token;
            });
          } catch (error) {
            get().logout();
            throw error;
          }
        },
      })),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectAuthLoading = (state: AuthStore) => state.isLoading;
export const selectAuthError = (state: AuthStore) => state.error;
