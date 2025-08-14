# State Management Stores

This directory is reserved for state management stores using Zustand or other state management libraries.

## Structure

```
stores/
├── auth.store.ts       # Authentication state
├── user.store.ts       # User state and preferences
├── ui.store.ts         # UI state (modals, sidebars, etc.)
├── cart.store.ts       # Shopping cart (if e-commerce)
└── index.ts           # Barrel export
```

## Example Store (Zustand)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
```

## Usage

```typescript
import { useUserStore } from '@/stores/user.store';

function Profile() {
  const { user, setUser } = useUserStore();
  
  // Use the store state and actions
}
```

## Best Practices

1. **Keep stores focused** - One store per domain
2. **Use TypeScript** - Define interfaces for store state
3. **Persist when needed** - Use middleware for localStorage
4. **Avoid derived state** - Use selectors instead
5. **Document actions** - Clear naming and JSDoc comments
