import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Modal {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

interface Toast {
  id: string;
  title: string;
  description?: string | undefined;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals
  modals: Modal[];
  activeModalId: string | null;
  
  // Toasts
  toasts: Toast[];
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Mobile
  isMobile: boolean;
  mobileMenuOpen: boolean;
}

interface UIActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  
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
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

type UIStore = UIState & UIActions;

/**
 * UI Store
 * Manages global UI state
 */
export const useUIStore = create<UIStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      modals: [],
      activeModalId: null,
      toasts: [],
      globalLoading: false,
      loadingMessage: null,
      theme: 'system',
      isMobile: false,
      mobileMenuOpen: false,

      // Sidebar actions
      toggleSidebar: () => {
        set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        });
      },

      setSidebarOpen: (open) => {
        set((state) => {
          state.sidebarOpen = open;
        });
      },

      toggleSidebarCollapse: () => {
        set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        });
      },

      setSidebarCollapsed: (collapsed) => {
        set((state) => {
          state.sidebarCollapsed = collapsed;
        });
      },

      // Modal actions
      openModal: (modal) => {
        const id = `modal-${Date.now()}`;
        const newModal = { ...modal, id };
        
        set((state) => {
          state.modals.push(newModal);
          state.activeModalId = id;
        });
        
        return id;
      },

      closeModal: (id) => {
        set((state) => {
          if (id) {
            state.modals = state.modals.filter(m => m.id !== id);
            if (state.activeModalId === id) {
              state.activeModalId = state.modals[state.modals.length - 1]?.id || null;
            }
          } else if (state.activeModalId) {
            state.modals = state.modals.filter(m => m.id !== state.activeModalId);
            state.activeModalId = state.modals[state.modals.length - 1]?.id || null;
          }
        });
      },

      closeAllModals: () => {
        set((state) => {
          state.modals = [];
          state.activeModalId = null;
        });
      },

      // Toast actions
      showToast: (toast) => {
        const id = `toast-${Date.now()}`;
        const newToast = { ...toast, id };
        
        set((state) => {
          state.toasts.push(newToast);
        });
        
        // Auto-remove toast after duration
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },

      removeToast: (id) => {
        set((state) => {
          state.toasts = state.toasts.filter(t => t.id !== id);
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
          state.loadingMessage = message || null;
        });
      },

      // Theme actions
      setTheme: (theme) => {
        set((state) => {
          state.theme = theme;
        });
      },

      // Mobile actions
      setIsMobile: (isMobile) => {
        set((state) => {
          state.isMobile = isMobile;
          if (isMobile) {
            state.sidebarOpen = false;
          }
        });
      },

      toggleMobileMenu: () => {
        set((state) => {
          state.mobileMenuOpen = !state.mobileMenuOpen;
        });
      },

      setMobileMenuOpen: (open) => {
        set((state) => {
          state.mobileMenuOpen = open;
        });
      },
    })),
    {
      name: 'ui-store',
    }
  )
);

// Selectors
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectActiveModal = (state: UIStore) => 
  state.modals.find(m => m.id === state.activeModalId);
export const selectToasts = (state: UIStore) => state.toasts;
export const selectTheme = (state: UIStore) => state.theme;
export const selectIsMobile = (state: UIStore) => state.isMobile;

// Helper hooks
export const useToast = () => {
  const showToast = useUIStore(state => state.showToast);
  
  return {
    success: (title: string, description?: string) => 
      showToast({ title, description, type: 'success' }),
    error: (title: string, description?: string) => 
      showToast({ title, description, type: 'error' }),
    warning: (title: string, description?: string) => 
      showToast({ title, description, type: 'warning' }),
    info: (title: string, description?: string) => 
      showToast({ title, description, type: 'info' }),
  };
};
