# State Management Guide

This guide covers state management patterns using Zustand, including store design, best practices, and integration with React components.

## Overview

The application uses **Zustand** for state management, providing a lightweight, type-safe solution for managing application state. Zustand offers:

- **TypeScript Support**: Full type safety with strict typing
- **Minimal Boilerplate**: Simple API with powerful features
- **React Integration**: Seamless integration with React hooks
- **Performance**: Efficient re-renders and updates
- **DevTools**: Built-in Redux DevTools support

## Store Architecture

### Store Structure
```
src/stores/
├── index.ts              # Store exports
├── auth.store.ts         # Authentication state
├── ui.store.ts           # UI state (theme, toasts, etc.)
├── user.store.ts         # User data and preferences
└── README.md            # Store documentation
```

### Store Design Principles

1. **Single Responsibility**: Each store manages one domain
2. **Type Safety**: Strict TypeScript interfaces for all state
3. **Immutability**: State updates are immutable
4. **Composability**: Stores can be combined and composed
5. **Performance**: Efficient updates and minimal re-renders

## Core Stores

### Authentication Store

```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string): Promise<void> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const { user, token } = await response.json();
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      logout: (): void => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      register: async (userData: RegisterData): Promise<void> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const { user, token } = await response.json();
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
        }
      },

      clearError: (): void => {
        set({ error: null });
      },

      setUser: (user: User): void => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### UI Store

```typescript
// src/stores/ui.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Theme
  theme: Theme;
  
  // Sidebar
  sidebarOpen: boolean;
  
  // Toasts
  toasts: Toast[];
  
  // Loading states
  globalLoading: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: false,
      toasts: [],
      globalLoading: false,

      // Actions
      setTheme: (theme: Theme): void => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
      },

      toggleSidebar: (): void => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      addToast: (toast: Omit<Toast, 'id'>): void => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
          id,
          duration: 5000,
          ...toast,
        };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto-remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }
      },

      removeToast: (id: string): void => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      clearToasts: (): void => {
        set({ toasts: [] });
      },

      setGlobalLoading: (loading: boolean): void => {
        set({ globalLoading: loading });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Toast convenience functions
export const useToast = () => {
  const { addToast } = useUIStore();
  
  return {
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
  };
};
```

## Using Stores in Components

### Basic Usage

```typescript
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

function UserProfile() {
  const { user, logout, isLoading } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      
      <div>
        <label>Theme:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Selective Subscriptions

```typescript
// Only re-render when specific state changes
function ThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// Subscribe to multiple stores
function Header() {
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header>
      <button onClick={toggleSidebar}>
        {sidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>
      {user && <span>Welcome, {user.name}</span>}
    </header>
  );
}
```

### Async Actions with Loading States

```typescript
function LoginForm() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      // Error is handled in the store
      toast.error('Login failed', error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Advanced Patterns

### Computed State

```typescript
interface UserStore {
  users: User[];
  selectedUserId: string | null;
  
  // Computed state
  selectedUser: User | null;
  activeUsers: User[];
  
  // Actions
  setUsers: (users: User[]) => void;
  selectUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  selectedUserId: null,

  // Computed getters
  get selectedUser() {
    const { users, selectedUserId } = get();
    return users.find(user => user.id === selectedUserId) ?? null;
  },

  get activeUsers() {
    const { users } = get();
    return users.filter(user => user.status === 'active');
  },

  // Actions
  setUsers: (users: User[]) => set({ users }),
  selectUser: (id: string) => set({ selectedUserId: id }),
}));
```

### Store Composition

```typescript
// Combine multiple stores
export const useAppStore = () => {
  const auth = useAuthStore();
  const ui = useUIStore();
  const user = useUserStore();

  return {
    // Auth
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,

    // UI
    theme: ui.theme,
    setTheme: ui.setTheme,
    addToast: ui.addToast,

    // User data
    users: user.users,
    selectedUser: user.selectedUser,
    selectUser: user.selectUser,
  };
};
```

### Middleware Integration

```typescript
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    subscribeWithSelector(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      })
    ),
    {
      name: 'counter-store',
    }
  )
);

// Subscribe to state changes
useCounterStore.subscribe(
  (state) => state.count,
  (count) => {
    console.log('Count changed to:', count);
  }
);
```

## Best Practices

### 1. Store Organization

- **Single Responsibility**: Each store manages one domain
- **Clear Interfaces**: Define strict TypeScript interfaces
- **Action Naming**: Use descriptive action names
- **Error Handling**: Include error states and handling

### 2. Performance Optimization

```typescript
// Use selective subscriptions to prevent unnecessary re-renders
const user = useAuthStore((state) => state.user);
const theme = useUIStore((state) => state.theme);

// Use shallow comparison for objects
const user = useAuthStore(
  (state) => state.user,
  (a, b) => a?.id === b?.id
);
```

### 3. Type Safety

```typescript
// Define strict interfaces
interface StoreState {
  data: DataType;
  loading: boolean;
  error: string | null;
  actions: {
    fetchData: () => Promise<void>;
    updateData: (data: Partial<DataType>) => void;
  };
}

// Use discriminated unions for complex state
type AuthState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'error'; error: string };
```

### 4. Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/auth.store';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });
});
```

## Migration from Other State Managers

### From Redux

```typescript
// Redux pattern
const mapStateToProps = (state) => ({
  user: state.auth.user,
  theme: state.ui.theme,
});

// Zustand equivalent
const user = useAuthStore((state) => state.user);
const theme = useUIStore((state) => state.theme);
```

### From Context API

```typescript
// Context pattern
const { user, login } = useContext(AuthContext);

// Zustand equivalent
const { user, login } = useAuthStore();
```

## Debugging and DevTools

### Redux DevTools Integration

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    (set) => ({
      // Your store implementation
    }),
    {
      name: 'store-name',
    }
  )
);
```

### Store Logging

```typescript
// Subscribe to all state changes
useAuthStore.subscribe(
  (state) => state,
  (state) => {
    console.log('Auth state changed:', state);
  }
);
```

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}
