import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Toast {
  id: string;
  title: string;
  description?: string | undefined;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  // Toasts
  toasts: Toast[];
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Mobile
  isMobile: boolean;
}

interface UIActions {
  // Toast actions
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Mobile actions
  setIsMobile: (isMobile: boolean) => void;
}

type UIStore = UIState & UIActions;

/**
 * UI Store
 * Manages global UI state for authentication pages
 */
export const useUIStore = create<UIStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      toasts: [],
      globalLoading: false,
      loadingMessage: null,
      theme: 'system',
      isMobile: false,

      // Toast actions
      showToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => {
          state.toasts.push({ ...toast, id });
        });
        
        // Auto-remove toast after duration
        const duration = toast.duration ?? 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id) => {
        set((state) => {
          state.toasts = state.toasts.filter(toast => toast.id !== id);
        });
      },

      clearToasts: () => {
        set((state) => {
          state.toasts = [];
        });
      },

      // Loading actions
      setGlobalLoading: (loading, message) => {
        set((state) => {
          state.globalLoading = loading;
          state.loadingMessage = message ?? null;
        });
      },

      // Theme actions
      setTheme: (theme) => {
        set((state) => {
          state.theme = theme;
        });
        
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },

      // Mobile actions
      setIsMobile: (isMobile) => {
        set((state) => {
          state.isMobile = isMobile;
        });
      },
    }))
  )
);

// Selectors
export const selectSidebarOpen = (_state: UIStore): boolean => false; // TODO: Implement when sidebar is added
export const selectActiveModal = (_state: UIStore): string | null => null; // TODO: Implement when modals are added
export const selectToasts = (state: UIStore): Toast[] => state.toasts;
export const selectTheme = (state: UIStore): 'light' | 'dark' | 'system' => state.theme;
export const selectIsMobile = (state: UIStore): boolean => state.isMobile;

// Custom hook for toast management
export const useToast = () => {
  const { showToast, removeToast, clearToasts } = useUIStore();
  return { showToast, removeToast, clearToasts };
};
