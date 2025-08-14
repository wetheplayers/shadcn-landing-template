# TypeScript Strict Mode Rules and Best Practices

## 🎯 Core Principles

### MANDATORY: All code MUST be TypeScript - NO JavaScript
- **File Extension**: Always use `.ts` or `.tsx` files
- **Type Annotations**: Explicit types for all parameters, return values, and variables
- **No Implicit Any**: Every value must have a known type

### Type Safety First
```typescript
// ❌ BAD - Implicit any
function process(data) { return data; }

// ✅ GOOD - Explicit types
function process<T>(data: T): T { return data; }
```

## ⚙️ TypeScript Configuration (tsconfig.json)

### Required Compiler Options
```json
{
  "compilerOptions": {
    // STRICT MODE - ALL MUST BE TRUE
    "strict": true,                           // Enable all strict type checking options
    "noImplicitAny": true,                   // Error on expressions with implicit 'any'
    "strictNullChecks": true,                // Enable strict null checks
    "strictFunctionTypes": true,             // Enable strict checking of function types
    "strictBindCallApply": true,             // Enable strict 'bind', 'call', and 'apply'
    "strictPropertyInitialization": true,    // Enable strict property initialization
    "noImplicitThis": true,                  // Error on 'this' expressions with implicit 'any'
    "alwaysStrict": true,                   // Parse in strict mode and emit "use strict"
    
    // ADDITIONAL SAFETY
    "noUnusedLocals": true,                 // Report errors on unused locals
    "noUnusedParameters": true,             // Report errors on unused parameters
    "noImplicitReturns": true,              // Report error when not all paths return
    "noFallthroughCasesInSwitch": true,    // Report errors for fallthrough cases
    "noUncheckedIndexedAccess": true,      // Include 'undefined' in index signatures
    "exactOptionalPropertyTypes": true,     // Differentiate between undefined and optional
    "noImplicitOverride": true,             // Ensure 'override' modifier is used
    "noPropertyAccessFromIndexSignature": true, // Require indexed access for index signatures
    
    // MODULE SETTINGS
    "module": "esnext",
    "target": "es2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // OUTPUT
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    
    // TYPE CHECKING
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "noEmitOnError": true,
    
    // LIBRARY SETTINGS
    "lib": ["es2022", "dom", "dom.iterable"],
    
    // MODERN FEATURES
    "useDefineForClassFields": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 📐 Type System Best Practices

### 1. No 'any' Type - Ever
```typescript
// ❌ NEVER DO THIS
let data: any = fetchData();
function process(input: any): any { }

// ✅ USE PROPER TYPES OR GENERICS
let data: UserData = fetchData();
function process<T>(input: T): ProcessedData<T> { }

// ✅ USE 'unknown' FOR TRULY UNKNOWN TYPES
function processUnknown(input: unknown): void {
  if (typeof input === 'string') {
    console.log(input.toUpperCase());
  }
}
```

### 2. Strict Null Checking
```typescript
// ❌ BAD - Ignoring potential null/undefined
function getLength(str: string | null) {
  return str.length; // Error: Object is possibly 'null'
}

// ✅ GOOD - Explicit null checks
function getLength(str: string | null): number {
  if (str === null) {
    return 0;
  }
  return str.length;
}

// ✅ BETTER - Non-null assertion when guaranteed
function getLength(str: string | null): number {
  return str?.length ?? 0;
}
```

### 3. Exact Optional Properties
```typescript
// With exactOptionalPropertyTypes: true
interface User {
  name: string;
  email?: string; // Can be missing or string, NOT undefined
}

// ❌ BAD
const user: User = {
  name: 'John',
  email: undefined // Error: Type 'undefined' is not assignable
};

// ✅ GOOD
const user: User = {
  name: 'John'
  // email is omitted
};
```

### 4. Index Signature Safety
```typescript
// With noUncheckedIndexedAccess: true
interface StringMap {
  [key: string]: string;
}

const map: StringMap = { hello: 'world' };

// ❌ BAD - Assumes value exists
const value: string = map['foo']; // Error: Type 'string | undefined'

// ✅ GOOD - Handle undefined
const value: string = map['foo'] ?? 'default';
```

## 🏗️ Interface and Type Definitions

### Interface Over Type Alias for Objects
```typescript
// ✅ PREFER - Interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ USE TYPE ALIAS - For unions, intersections, primitives
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;
type UserWithStatus = User & { status: Status };
```

### Readonly and Immutability
```typescript
// ✅ GOOD - Use readonly for immutable properties
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retryCount: number;
}

// ✅ BETTER - Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

## 🔧 Function Best Practices

### Explicit Return Types
```typescript
// ❌ BAD - Implicit return type
function calculate(a: number, b: number) {
  return a + b;
}

// ✅ GOOD - Explicit return type
function calculate(a: number, b: number): number {
  return a + b;
}

// ✅ GOOD - Async functions
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch {
    return null;
  }
}
```

### Function Type Signatures
```typescript
// ✅ GOOD - Clear function type definitions
type Predicate<T> = (value: T) => boolean;
type Mapper<T, U> = (value: T) => U;
type AsyncOperation<T> = () => Promise<T>;

// Usage
const isEven: Predicate<number> = (n) => n % 2 === 0;
const double: Mapper<number, number> = (n) => n * 2;
```

### Strict Function Types
```typescript
// With strictFunctionTypes: true
class Animal { name: string = ''; }
class Dog extends Animal { breed: string = ''; }

// ❌ BAD - Contravariant parameter types
let animalHandler: (a: Animal) => void;
let dogHandler: (d: Dog) => void;
animalHandler = dogHandler; // Error: Type '(d: Dog) => void' is not assignable

// ✅ GOOD - Correct variance
dogHandler = animalHandler; // OK: Dog is assignable to Animal
```

## 🏭 Class Best Practices

### Strict Property Initialization
```typescript
// ❌ BAD - Uninitialized properties
class User {
  name: string; // Error: Property 'name' has no initializer
  email: string;
}

// ✅ GOOD - All properties initialized
class User {
  name: string;
  email: string;
  
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

// ✅ ALTERNATIVE - Default values
class User {
  name: string = '';
  email: string = '';
  createdAt: Date = new Date();
}

// ✅ ALTERNATIVE - Definite assignment assertion (use sparingly)
class User {
  name!: string; // I promise to assign this before use
  
  constructor() {
    this.initialize();
  }
  
  private initialize(): void {
    this.name = 'Default';
  }
}
```

### Access Modifiers and Override
```typescript
// ✅ GOOD - Explicit access modifiers
abstract class BaseService {
  protected abstract readonly apiUrl: string;
  
  protected async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`);
    return response.json();
  }
}

// With noImplicitOverride: true
class UserService extends BaseService {
  protected override readonly apiUrl = '/api/users';
  
  // Error without 'override': This member must have an 'override' modifier
  protected override async request<T>(endpoint: string): Promise<T> {
    console.log(`Requesting: ${endpoint}`);
    return super.request<T>(endpoint);
  }
}
```

## 🎭 Type Guards and Narrowing

### Custom Type Guards
```typescript
// ✅ GOOD - Type predicate functions
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(pet: Cat | Dog): pet is Cat {
  return 'meow' in pet;
}

function handlePet(pet: Cat | Dog): void {
  if (isCat(pet)) {
    pet.meow(); // TypeScript knows this is Cat
  } else {
    pet.bark(); // TypeScript knows this is Dog
  }
}
```

### Discriminated Unions
```typescript
// ✅ EXCELLENT - Tagged unions for type safety
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: Error };

function processResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.data; // TypeScript knows 'data' exists
  } else {
    throw result.error; // TypeScript knows 'error' exists
  }
}
```

## 🔒 Const Assertions and Literal Types

### Use 'as const' for Literal Types
```typescript
// ❌ BAD - Loses literal type information
const config = {
  endpoint: '/api/users',
  method: 'GET',
  timeout: 5000
}; // Type: { endpoint: string; method: string; timeout: number }

// ✅ GOOD - Preserves literal types
const config = {
  endpoint: '/api/users',
  method: 'GET',
  timeout: 5000
} as const; // Type: { readonly endpoint: "/api/users"; readonly method: "GET"; readonly timeout: 5000 }

// ✅ EXCELLENT - Literal type unions
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'user' | 'guest'
```

## 🌐 Module System

### Import Type Syntax
```typescript
// ✅ GOOD - Explicit type imports
import type { User, UserRole } from './types';
import { validateUser } from './utils';

// ✅ BETTER - Combined syntax when needed
import { api, type ApiConfig } from './api';
```

### Module Augmentation
```typescript
// ✅ GOOD - Extending existing modules
declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
    session?: SessionData;
  }
}
```

## ⚠️ Error Handling

### Never Ignore Errors
```typescript
// ❌ BAD - Silent failures
try {
  await riskyOperation();
} catch (e) {
  // Silent failure
}

// ✅ GOOD - Proper error handling
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

async function safeOperation<T>(
  operation: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    }
    return { 
      success: false, 
      error: new Error('Unknown error occurred') 
    };
  }
}
```

## 🧪 Testing Considerations

### Type-Safe Mocks
```typescript
// ✅ GOOD - Type-safe test utilities
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    ...overrides
  };
}

// Type-safe spy functions
const mockApi = {
  getUser: jest.fn<Promise<User>, [string]>(),
  updateUser: jest.fn<Promise<User>, [string, Partial<User>]>()
};
```

## 📚 Utility Types

### Essential Built-in Utilities
```typescript
// Partial<T> - Make all properties optional
type PartialUser = Partial<User>;

// Required<T> - Make all properties required
type RequiredUser = Required<PartialUser>;

// Readonly<T> - Make all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick<T, K> - Pick specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit<T, K> - Omit specific properties
type PublicUser = Omit<User, 'password'>;

// Record<K, T> - Construct object type
type UserMap = Record<string, User>;

// Extract<T, U> - Extract types assignable to U
type StringKeys = Extract<keyof User, string>;

// Exclude<T, U> - Exclude types assignable to U
type NonStringKeys = Exclude<keyof User, string>;

// NonNullable<T> - Exclude null and undefined
type DefinitelyString = NonNullable<string | null | undefined>;

// ReturnType<T> - Extract return type
type GetUserReturn = ReturnType<typeof getUser>;

// Parameters<T> - Extract parameter types
type GetUserParams = Parameters<typeof getUser>;
```

## 🚫 Anti-Patterns to Avoid

### 1. Type Assertions Abuse
```typescript
// ❌ NEVER - Unsafe type assertions
const user = {} as User; // Lies to TypeScript

// ✅ GOOD - Proper validation
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}
```

### 2. Overuse of Non-Null Assertion
```typescript
// ❌ BAD - Risky non-null assertions
function processUser(user?: User) {
  console.log(user!.name); // Dangerous!
}

// ✅ GOOD - Proper checks
function processUser(user?: User) {
  if (!user) {
    throw new Error('User is required');
  }
  console.log(user.name); // Safe
}
```

### 3. String Literal Types Instead of Enums
```typescript
// ❌ AVOID - Numeric enums
enum Status {
  Active,
  Inactive,
  Pending
}

// ✅ PREFER - String literal unions
type Status = 'active' | 'inactive' | 'pending';

// ✅ OR - Const assertion pattern
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```

## 🎯 Quick Reference Checklist

- [ ] `strict: true` in tsconfig.json
- [ ] No `any` types anywhere
- [ ] All functions have explicit return types
- [ ] All class properties are initialized
- [ ] Proper null/undefined handling
- [ ] Type imports use `import type`
- [ ] Error handling never silently fails
- [ ] Index signatures include `| undefined`
- [ ] Optional properties use exact types
- [ ] Override modifier on inherited methods
- [ ] Const assertions for literal types
- [ ] Discriminated unions for complex types
- [ ] Type guards for runtime safety
- [ ] No unnecessary type assertions
- [ ] Prefer interfaces over type aliases for objects

## 🤖 LLM Instructions

When generating TypeScript code:
1. **ALWAYS** enable all strict options
2. **NEVER** use `any` type
3. **ALWAYS** provide explicit return types
4. **ALWAYS** handle null/undefined cases
5. **PREFER** immutability with `readonly`
6. **USE** discriminated unions for state
7. **IMPLEMENT** proper error boundaries
8. **VALIDATE** external data with type guards
9. **DOCUMENT** complex types with JSDoc
10. **TEST** with type-safe mocks

Remember: The goal is zero runtime type errors through compile-time safety! 