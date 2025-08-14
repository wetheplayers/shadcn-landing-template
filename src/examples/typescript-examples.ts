/**
 * TypeScript Strict Mode Examples
 * This file demonstrates best practices for strict TypeScript
 */

// ============================================
// 1. NO ANY TYPES - Use proper types or generics
// ============================================

// ❌ BAD - Never use 'any'
// function processData(data: any): any { return data; }

// ✅ GOOD - Use generics for flexible types
function processData<T>(data: T): T {
  return data;
}

// ✅ GOOD - Use 'unknown' for truly unknown types
function handleUnknown(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return 'Unknown value';
}

// ============================================
// 2. STRICT NULL CHECKING
// ============================================

interface User {
  id: string;
  name: string;
  email?: string; // Optional property
}

// ✅ GOOD - Handle potential null/undefined
function getUserEmail(user: User | null): string {
  // Guard against null
  if (!user) {
    return 'No user provided';
  }
  
  // Handle optional property
  return user.email ?? 'No email provided';
}

// ============================================
// 3. DISCRIMINATED UNIONS FOR STATE
// ============================================

type LoadingState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleState<T>(state: LoadingState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Ready to load';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Loaded: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}

// ============================================
// 4. TYPE GUARDS FOR RUNTIME SAFETY
// ============================================

interface Dog {
  type: 'dog';
  bark(): void;
}

interface Cat {
  type: 'cat';
  meow(): void;
}

type Pet = Dog | Cat;

// Type guard function
function isDog(pet: Pet): pet is Dog {
  return pet.type === 'dog';
}

function handlePet(pet: Pet): void {
  if (isDog(pet)) {
    pet.bark(); // TypeScript knows this is a Dog
  } else {
    pet.meow(); // TypeScript knows this is a Cat
  }
}

// ============================================
// 5. EXPLICIT RETURN TYPES
// ============================================

// ✅ GOOD - Always specify return types
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json() as Promise<User>;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

// ============================================
// 6. READONLY AND IMMUTABILITY
// ============================================

interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retryCount: number;
}

// Const assertion for literal types
const ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments'
} as const;

type Endpoint = typeof ENDPOINTS[keyof typeof ENDPOINTS];

// Example usage of ENDPOINTS
const getUserEndpoint = (): string => ENDPOINTS.users;

// ============================================
// 7. ERROR HANDLING WITH RESULT TYPES
// ============================================

type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeApiCall<T>(
  url: string
): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json() as T;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// ============================================
// 8. STRICT CLASS INITIALIZATION
// ============================================

class UserService {
  private readonly apiUrl: string;
  private readonly cache: Map<string, User>;
  
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
  }
  
  async getUser(id: string): Promise<User | null> {
    // Check cache first
    const cached = this.cache.get(id);
    if (cached) {
      return cached;
    }
    
    // Fetch from API
    const result = await safeApiCall<User>(`${this.apiUrl}/users/${id}`);
    
    if (result.success) {
      this.cache.set(id, result.data);
      return result.data;
    }
    
    console.error('Failed to fetch user:', result.error);
    return null;
  }
}

// ============================================
// 9. UTILITY TYPES IN ACTION
// ============================================

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

// Create a type for product updates (all fields optional)
type ProductUpdate = Partial<Product>;

// Create a type for new products (omit id)
type NewProduct = Omit<Product, 'id'>;

// Create a readonly version (example - not exported)
// type ReadonlyProduct = Readonly<Product>;

// Pick specific fields
type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>;

// ============================================
// 10. TEMPLATE LITERAL TYPES
// ============================================

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = `/api/${string}`;

interface ApiRequest {
  method: HttpMethod;
  endpoint: ApiEndpoint;
  body?: unknown;
}

async function makeApiRequest(request: ApiRequest): Promise<Result<unknown>> {
  const { endpoint } = request;
  // In a real implementation, method and body would be used
  // const { method, endpoint, body } = request;
  
  return safeApiCall(endpoint);
}

// ============================================
// EXPORTS
// ============================================

export {
  processData,
  handleUnknown,
  getUserEmail,
  handleState,
  handlePet,
  fetchUser,
  safeApiCall,
  UserService,
  makeApiRequest,
  getUserEndpoint
};

export type {
  User,
  LoadingState,
  Pet,
  Result,
  Config,
  Endpoint,
  Product,
  ProductUpdate,
  NewProduct,
  ProductSummary,
  ApiRequest
}; 