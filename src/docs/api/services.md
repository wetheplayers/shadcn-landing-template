# Services Reference

This document provides comprehensive documentation for the API service layer and related utilities.

## Service Architecture

### Overview

The application uses a centralized service layer for all API interactions, providing:

- **Type Safety**: Full TypeScript support with strict typing
- **Error Handling**: Consistent error handling across all services
- **Authentication**: Automatic token management and refresh
- **Caching**: Intelligent caching strategies
- **Interceptors**: Request/response transformation
- **Retry Logic**: Automatic retry for failed requests

### Service Structure

```
src/services/
├── index.ts              # Service exports
├── api.service.ts        # Base API service
├── user.service.ts       # User-related API calls
├── auth.service.ts       # Authentication service
└── types/               # Service-specific types
    ├── api.types.ts
    ├── user.types.ts
    └── auth.types.ts
```

## Base API Service

### ApiService

The core API service that handles all HTTP requests.

```typescript
import { apiService } from '@/services/api.service';

interface ApiService {
  // HTTP Methods
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;

  // Configuration
  setBaseURL(url: string): void;
  setAuthToken(token: string): void;
  clearAuthToken(): void;
  setDefaultHeaders(headers: Record<string, string>): void;

  // Interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
}
```

#### Usage Examples

```typescript
// Basic GET request
const users = await apiService.get<User[]>('/api/users');

// POST request with data
const newUser = await apiService.post<User>('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT request with custom headers
const updatedUser = await apiService.put<User>('/api/users/1', userData, {
  headers: { 'Content-Type': 'application/json' },
});

// DELETE request
await apiService.delete('/api/users/1');

// With query parameters
const filteredUsers = await apiService.get<User[]>('/api/users', {
  params: { status: 'active', limit: 10 },
});
```

#### Configuration

```typescript
// Set base URL
apiService.setBaseURL('https://api.example.com');

// Set authentication token
apiService.setAuthToken('your-jwt-token');

// Set default headers
apiService.setDefaultHeaders({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Add request interceptor
apiService.addRequestInterceptor((config) => {
  // Add timestamp to all requests
  config.headers['X-Request-Time'] = new Date().toISOString();
  return config;
});

// Add response interceptor
apiService.addResponseInterceptor((response) => {
  // Log all responses
  console.log('API Response:', response);
  return response;
});
```

## User Service

### UserService

Service for user-related API operations.

```typescript
import { userService } from '@/services/user.service';

interface UserService {
  // User CRUD operations
  getUsers(params?: GetUsersParams): Promise<User[]>;
  getUser(id: string): Promise<User>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(id: string, userData: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // User profile operations
  getCurrentUser(): Promise<User>;
  updateProfile(profileData: UpdateProfileData): Promise<User>;
  uploadAvatar(file: File): Promise<{ avatarUrl: string }>;

  // User preferences
  getUserPreferences(): Promise<UserPreferences>;
  updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences>;
}
```

#### Usage Examples

```typescript
// Get all users with pagination
const users = await userService.getUsers({
  page: 1,
  limit: 20,
  status: 'active',
});

// Get specific user
const user = await userService.getUser('user-id');

// Create new user
const newUser = await userService.createUser({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'secure-password',
});

// Update user
const updatedUser = await userService.updateUser('user-id', {
  name: 'Jane Smith',
  bio: 'Updated bio',
});

// Get current user profile
const currentUser = await userService.getCurrentUser();

// Update profile
const updatedProfile = await userService.updateProfile({
  name: 'New Name',
  bio: 'New bio',
  location: 'London, UK',
});

// Upload avatar
const avatarResult = await userService.uploadAvatar(file);
console.log('Avatar URL:', avatarResult.avatarUrl);
```

## Authentication Service

### AuthService

Service for authentication and authorization operations.

```typescript
import { authService } from '@/services/auth.service';

interface AuthService {
  // Authentication
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(userData: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthResponse>;

  // Password operations
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;

  // Session management
  validateSession(): Promise<boolean>;
  revokeSession(): Promise<void>;
}
```

#### Usage Examples

```typescript
// Login
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Register
const registerResponse = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
});

// Logout
await authService.logout();

// Refresh token
const newAuthResponse = await authService.refreshToken();

// Forgot password
await authService.forgotPassword('user@example.com');

// Reset password
await authService.resetPassword('reset-token', 'new-password');

// Change password
await authService.changePassword('current-password', 'new-password');

// Validate session
const isValid = await authService.validateSession();
```

## Type Definitions

### API Types

```typescript
// src/services/types/api.types.ts

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: unknown;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig;
type ResponseInterceptor = (response: ApiResponse<unknown>) => ApiResponse<unknown>;
```

### User Types

```typescript
// src/services/types/user.types.ts

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  status?: User['status'];
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  status?: User['status'];
  role?: User['role'];
  search?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLocation: boolean;
  };
}
```

### Auth Types

```typescript
// src/services/types/auth.types.ts

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  avatar?: File;
}
```

## Error Handling

### Error Types

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Handling Examples

```typescript
// Service-level error handling
try {
  const user = await userService.getUser('user-id');
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Handle unauthorized
        authService.logout();
        break;
      case 403:
        // Handle forbidden
        showForbiddenMessage();
        break;
      case 404:
        // Handle not found
        showNotFoundMessage();
        break;
      case 422:
        // Handle validation errors
        showValidationErrors(error.details);
        break;
      default:
        // Handle other errors
        showErrorMessage(error.message);
    }
  } else if (error instanceof NetworkError) {
    // Handle network errors
    showNetworkErrorMessage();
  } else {
    // Handle unknown errors
    showGenericErrorMessage();
  }
}

// Global error handling
apiService.addResponseInterceptor((response) => {
  if (response.status >= 400) {
    throw new ApiError(
      response.data?.message || 'Request failed',
      response.status,
      response.data?.code || 'UNKNOWN_ERROR',
      response.data
    );
  }
  return response;
});
```

## Caching

### Cache Implementation

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Caching Examples

```typescript
// Cache user data
const getUserWithCache = async (id: string): Promise<User> => {
  const cacheKey = `user:${id}`;
  const cached = cache.get<User>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const user = await userService.getUser(id);
  cache.set(cacheKey, user, 10 * 60 * 1000); // 10 minutes
  return user;
};

// Invalidate cache on update
const updateUserWithCache = async (id: string, data: UpdateUserData): Promise<User> => {
  const user = await userService.updateUser(id, data);
  cache.invalidate(`user:${id}`);
  return user;
};
```

## Request/Response Interceptors

### Request Interceptors

```typescript
// Authentication interceptor
apiService.addRequestInterceptor((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return config;
});

// Logging interceptor
apiService.addRequestInterceptor((config) => {
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Retry interceptor
apiService.addRequestInterceptor((config) => {
  config.retry = {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential',
  };
  return config;
});
```

### Response Interceptors

```typescript
// Error handling interceptor
apiService.addResponseInterceptor((response) => {
  if (response.status >= 400) {
    throw new ApiError(
      response.data?.message || 'Request failed',
      response.status,
      response.data?.code || 'UNKNOWN_ERROR',
      response.data
    );
  }
  return response;
});

// Token refresh interceptor
apiService.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    try {
      const newAuth = await authService.refreshToken();
      // Retry original request with new token
      return apiService.request(response.config);
    } catch (error) {
      // Refresh failed, redirect to login
      authService.logout();
      window.location.href = '/login';
    }
  }
  return response;
});
```

## Testing Services

### Service Testing Examples

```typescript
import { userService } from '@/services/user.service';

// Mock the base API service
jest.mock('@/services/api.service', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get users', async () => {
    const mockUsers = [
      { id: '1', name: 'John', email: 'john@example.com' },
      { id: '2', name: 'Jane', email: 'jane@example.com' },
    ];

    (apiService.get as jest.Mock).mockResolvedValue(mockUsers);

    const result = await userService.getUsers();

    expect(apiService.get).toHaveBeenCalledWith('/api/users');
    expect(result).toEqual(mockUsers);
  });

  it('should handle API errors', async () => {
    const error = new ApiError('User not found', 404, 'USER_NOT_FOUND');
    (apiService.get as jest.Mock).mockRejectedValue(error);

    await expect(userService.getUser('invalid-id')).rejects.toThrow(ApiError);
  });
});
```

## Best Practices

### 1. Service Organization

- Keep services focused on specific domains
- Use consistent naming conventions
- Implement proper error handling
- Add comprehensive logging

### 2. Type Safety

- Define strict interfaces for all data structures
- Use discriminated unions for complex types
- Validate API responses
- Handle optional fields properly

### 3. Performance

- Implement intelligent caching
- Use request deduplication
- Optimize payload sizes
- Monitor API performance

### 4. Security

- Validate all inputs
- Sanitize data before sending
- Handle sensitive data properly
- Implement proper authentication

### 5. Error Handling

- Provide meaningful error messages
- Implement retry logic
- Handle network failures gracefully
- Log errors for debugging

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}
