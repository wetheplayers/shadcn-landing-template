import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { authService, AuthService, type LoginCredentials, type RegisterData } from '@/services/auth.service';
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
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  
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
        login: async (credentials: LoginCredentials) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.login(credentials);
            
            set((state) => {
              state.user = response.user;
              state.token = response.token;
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
          const token = get().token;
          
          // Call logout API if token exists
          if (token) {
            void authService.logout(token).catch((error) => {
              // Continue with local logout even if API call fails
              console.warn('Logout API call failed:', error);
            });
          }

          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          });
        },

        // Register action
        register: async (userData: RegisterData) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.register(userData);
            
            set((state) => {
              state.user = response.user;
              state.token = response.token;
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
          const state = get();
          
          // If already authenticated and have user, don't check again
          if (state.isAuthenticated && state.user && state.token) {
            return;
          }
          
          // If no token, logout
          if (!state.token) {
            state.logout();
            return;
          }

          // Check if token is expired
          if (AuthService.isTokenExpired(state.token)) {
            state.logout();
            return;
          }

          set((draft) => {
            draft.isLoading = true;
          });

          try {
            // For demo authentication, just verify the token exists
            if (state.token === 'demo-jwt-token-123') {
              // If user doesn't exist, create a demo user
              if (!state.user) {
                const demoUser: User = {
                  id: 'demo-user-1',
                  name: 'Demo User',
                  email: 'demo@example.com',
                  avatar: '/avatars/demo.jpg',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
                set((draft) => {
                  draft.user = demoUser;
                });
              }
              
              set((draft) => {
                draft.isAuthenticated = true;
                draft.isLoading = false;
                draft.error = null;
              });
              return;
            }

            // Validate session with server
            const user = await authService.validateSession(state.token);
            
            set((draft) => {
              draft.user = user;
              draft.isAuthenticated = true;
              draft.isLoading = false;
              draft.error = null;
            });
          } catch (_error) {
            get().logout();
            set((draft) => {
              draft.isLoading = false;
            });
          }
        },

        // Refresh token
        refreshToken: async () => {
          const token = get().token;
          if (!token) return;

          try {
            // For demo authentication, just return early (no refresh needed)
            if (token === 'demo-jwt-token-123') {
              return;
            }

            // Refresh token with server
            const response = await authService.refreshToken(token);
            
            set((state) => {
              state.token = response.token;
            });
          } catch (_error) {
            get().logout();
            throw new Error('Token refresh failed');
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
        onRehydrateStorage: () => (state) => {
          console.log('Auth store rehydrated:', state);
        },
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
