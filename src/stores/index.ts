/**
 * State Management Stores
 * Centralized state management using Zustand
 */

// Auth store
export {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from './auth.store';

// UI store
export {
  useUIStore,
  selectSidebarOpen,
  selectActiveModal,
  selectToasts,
  selectTheme,
  selectIsMobile,
  useToast,
} from './ui.store';

// Type exports
export type { User } from '@/types';
