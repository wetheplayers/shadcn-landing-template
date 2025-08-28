# Supabase Integration Guide

This guide covers the Supabase integration in the application, including database schema, authentication, realtime features, and best practices.

## Overview

This application integrates with Supabase to provide:

- **PostgreSQL Database** - Scalable relational database with advanced features
- **Authentication** - User authentication and session management
- **Realtime** - Live data updates and subscriptions
- **Row Level Security (RLS)** - Fine-grained access control
- **Edge Functions** - Serverless functions for backend logic
- **Storage** - File upload and management

## Project Configuration

### Supabase Project Details
- **Project Reference**: `fwlpmyyfvzqxvwgizrpg`
- **Region**: Auto-selected based on location
- **Database**: PostgreSQL 15+ with extensions
- **Storage**: Integrated file storage with CDN

### Environment Variables

Required environment variables for Supabase integration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fwlpmyyfvzqxvwgizrpg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Custom settings
NEXT_PUBLIC_SUPABASE_SCHEMA=public
SUPABASE_JWT_SECRET=your_jwt_secret
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

#### Profiles Table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  bio TEXT,
  location TEXT,
  website TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Triggers and Functions

#### Updated At Trigger
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Authentication Integration

### Client Setup

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
```

### Server Components

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createClient = () => {
  return createServerComponentClient({ cookies });
};

// Usage in server components
export async function getServerUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}
```

### Auth Store Integration

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@/lib/supabase/client';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await auth.signIn(email, password);
          
          if (error) throw error;
          
          set({
            user: data.user,
            session: data.session,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Sign in failed',
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await auth.signUp(email, password);
          
          if (error) throw error;
          
          set({
            user: data.user,
            session: data.session,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Sign up failed',
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true });
        
        try {
          const { error } = await auth.signOut();
          
          if (error) throw error;
          
          set({
            user: null,
            session: null,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Sign out failed',
          });
        }
      },

      setUser: (user: User | null) => set({ user }),
      setSession: (session: any | null) => set({ session }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
```

## Realtime Features

### Subscribing to Changes

```typescript
// hooks/use-realtime.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface UseRealtimeOptions {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}

export function useRealtime<T>({ table, filter, event = '*' }: UseRealtimeOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select('*');
        
        if (filter) {
          query = query.filter(filter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setData(data || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          setData((currentData) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...currentData, payload.new as T];
              case 'UPDATE':
                return currentData.map((item: any) =>
                  item.id === payload.new.id ? payload.new : item
                );
              case 'DELETE':
                return currentData.filter((item: any) => item.id !== payload.old.id);
              default:
                return currentData;
            }
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter, event]);

  return { data, loading, error };
}
```

### Usage Example

```typescript
// components/realtime-user-list.tsx
import { useRealtime } from '@/hooks/use-realtime';

interface User {
  id: string;
  name: string;
  email: string;
  online: boolean;
}

export function RealtimeUserList() {
  const { data: users, loading, error } = useRealtime<User>({
    table: 'users',
    filter: 'online.eq.true',
    event: '*',
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Online Users ({users.length})</h2>
      {users.map((user) => (
        <div key={user.id} className="user-item">
          <span>{user.name}</span>
          <span className="online-indicator">●</span>
        </div>
      ))}
    </div>
  );
}
```

## Database Operations

### Type-Safe Database Queries

```typescript
// lib/supabase/database.ts
import { supabase } from './client';

// User operations
export const userOperations = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  async searchUsers(query: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, bio, avatar_url')
      .or(`username.ilike.%${query}%, bio.ilike.%${query}%`)
      .limit(10);
    
    return { data, error };
  },
};

// Generic CRUD operations
export function createCRUD<T>(tableName: string) {
  return {
    async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>) {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      
      return { data: result, error };
    },

    async read(id: string) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    },

    async update(id: string, updates: Partial<T>) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return { data, error };
    },

    async delete(id: string) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      return { error };
    },

    async list(filters?: Record<string, any>, limit = 50, offset = 0) {
      let query = supabase
        .from(tableName)
        .select('*')
        .range(offset, offset + limit - 1);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error, count } = await query;
      
      return { data, error, count };
    },
  };
}
```

## Edge Functions

### Creating Edge Functions

```typescript
// supabase/functions/user-profile/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Set the auth token
    supabaseClient.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    });

    // Get user from auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    // Process the request
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ user: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
```

### Deploying Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy function
supabase functions deploy user-profile

# Set environment variables
supabase secrets set EXTERNAL_API_KEY=your_key
```

## Row Level Security (RLS)

### Common RLS Patterns

```sql
-- 1. Users can only access their own data
CREATE POLICY "Users own data" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- 2. Public read, authenticated write
CREATE POLICY "Public read" ON table_name
  FOR SELECT USING (true);

CREATE POLICY "Authenticated write" ON table_name
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Role-based access
CREATE POLICY "Admin full access" ON table_name
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- 4. Time-based access
CREATE POLICY "Business hours access" ON table_name
  FOR ALL USING (
    EXTRACT(HOUR FROM NOW()) BETWEEN 9 AND 17
  );

-- 5. Conditional access based on data
CREATE POLICY "Published content" ON posts
  FOR SELECT USING (
    status = 'published' OR author_id = auth.uid()
  );
```

### Testing RLS Policies

```sql
-- Test as specific user
SET request.jwt.claims = '{"sub": "user-id", "role": "authenticated"}';

-- Test query
SELECT * FROM protected_table;

-- Reset
RESET request.jwt.claims;
```

## Storage Integration

### File Upload

```typescript
// lib/supabase/storage.ts
import { supabase } from './client';

export const storage = {
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { upsert?: boolean }
  ) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, options);
    
    return { data, error };
  },

  async downloadFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    
    return { data, error };
  },

  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    return { error };
  },

  async listFiles(bucket: string, path?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);
    
    return { data, error };
  },
};

// Avatar upload helper
export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error } = await storage.uploadFile('avatars', filePath, file, {
    upsert: true,
  });

  if (error) throw error;

  const publicUrl = storage.getPublicUrl('avatars', filePath);
  
  return { publicUrl, path: filePath };
}
```

## Best Practices

### 1. Security

- **Always enable RLS** on user tables
- **Use proper policies** for data access
- **Validate inputs** in Edge Functions
- **Use service role key** only server-side
- **Rotate secrets** regularly

### 2. Performance

- **Use indexes** on frequently queried columns
- **Implement pagination** for large datasets
- **Use select()** to limit returned fields
- **Cache frequent queries** on the client
- **Monitor query performance** in dashboard

### 3. Type Safety

```typescript
// Generate types from database schema
npx supabase gen types typescript --project-id fwlpmyyfvzqxvwgizrpg > types/supabase.ts

// Use generated types
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
```

### 4. Error Handling

```typescript
// Standardized error handling
export function handleSupabaseError(error: any): string {
  if (error?.code === 'PGRST116') {
    return 'Record not found';
  }
  
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  
  if (error?.message?.includes('JWT')) {
    return 'Authentication required';
  }
  
  return error?.message || 'An unexpected error occurred';
}
```

### 5. Development Workflow

```bash
# Start local development
supabase start

# Reset database
supabase db reset

# Generate migration
supabase db diff --file migration_name

# Apply migrations
supabase db push

# Stop local development
supabase stop
```

## Monitoring and Debugging

### Enable Logging

```typescript
// Enable debug logging
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key, {
  auth: {
    debug: process.env.NODE_ENV === 'development',
  },
});
```

### Performance Monitoring

```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_total_relation_size(schemaname||'.'||tablename) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Migration Strategies

### Schema Changes

```sql
-- Always use transactions for schema changes
BEGIN;

-- Add column with default value
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- Update existing data if needed
UPDATE users SET role = 'admin' WHERE email LIKE '%@company.com';

-- Add constraint
ALTER TABLE users ADD CONSTRAINT check_role 
  CHECK (role IN ('user', 'admin', 'moderator'));

COMMIT;
```

### Data Migration

```typescript
// scripts/migrate-data.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateUserProfiles() {
  // Fetch all users
  const { data: users, error } = await supabase
    .from('auth.users')
    .select('id, email, raw_user_meta_data');

  if (error) throw error;

  // Create profiles
  for (const user of users) {
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        username: user.raw_user_meta_data?.username,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error(`Failed to migrate user ${user.id}:`, insertError);
    }
  }
}

migrateUserProfiles().catch(console.error);
```

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}

For more information, visit the [Supabase Documentation](https://supabase.com/docs) or check the project dashboard.
