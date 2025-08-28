# ESLint Configuration for Strict TypeScript

## Overview

This document describes the ESLint configuration that enforces strict TypeScript best practices, aligned with our TypeScript compiler settings.

## Key Features

### 🚫 No Any Types
- `@typescript-eslint/no-explicit-any`: Prevents use of `any` type
- `@typescript-eslint/no-unsafe-assignment`: Prevents assignment of `any` values
- `@typescript-eslint/no-unsafe-member-access`: Prevents accessing members of `any` typed values
- `@typescript-eslint/no-unsafe-call`: Prevents calling `any` typed values
- `@typescript-eslint/no-unsafe-return`: Prevents returning `any` typed values
- `@typescript-eslint/no-unsafe-argument`: Prevents passing `any` typed arguments

### 📝 Explicit Return Types
- `@typescript-eslint/explicit-function-return-type`: Requires explicit return types on functions
  - Relaxed for React components and common patterns
  - Allows expressions and typed function expressions
  - Special rules for `.tsx` files to accommodate React components

### ✅ Strict Null Checking
- `@typescript-eslint/no-non-null-assertion`: Prevents use of non-null assertion operator (`!`)
- `@typescript-eslint/no-non-null-asserted-optional-chain`: Prevents `?.!` pattern
- `@typescript-eslint/strict-boolean-expressions`: Enforces explicit boolean expressions
  - Configured to allow strings and nullable objects for React compatibility

### 📦 Type Imports
- `@typescript-eslint/consistent-type-imports`: Enforces using `import type` for type-only imports
  - Uses inline type imports: `import { api, type ApiConfig } from './api'`
- `@typescript-eslint/consistent-type-exports`: Ensures consistent type exports

### 🎯 Best Practices

#### Promise Handling
- `@typescript-eslint/no-floating-promises`: Ensures promises are properly handled
- `@typescript-eslint/no-misused-promises`: Prevents common promise mistakes
- `@typescript-eslint/await-thenable`: Only `await` on actual promises
- `@typescript-eslint/require-await`: Async functions must contain `await`
- `@typescript-eslint/promise-function-async`: Functions returning promises must be `async`

#### Code Organization
- `@typescript-eslint/member-ordering`: Enforces consistent member ordering in classes
- `import/order`: Enforces consistent import ordering
  - Groups: builtin → external → internal → parent/sibling → index → type
  - Alphabetical within groups
  - Newlines between groups

#### Naming Conventions
- Interfaces: `PascalCase`
- Type aliases: `PascalCase`
- Enums: `PascalCase`
- Enum members: `UPPER_CASE`

#### Type Safety
- `@typescript-eslint/prefer-readonly`: Enforces readonly for never-reassigned members
- `@typescript-eslint/array-type`: Consistent array type syntax
- `@typescript-eslint/consistent-type-assertions`: Controls type assertion style
  - Uses `as` syntax
  - Prevents object literal type assertions

## Configuration Files

### eslint.config.mjs
```javascript
// Key configurations:
- Parser: @typescript-eslint/parser
- Plugins: @typescript-eslint, import
- Extends: next/core-web-vitals, next/typescript
- Project-aware rules enabled via tsconfig.json
```

### Special Rules for React Components
- Relaxed return type requirements for component functions
- Boolean expressions allow nullable objects and strings
- Promise rules adjusted for event handlers

### Config File Exceptions
- Config files (*.config.*, *.setup.*, *.test.*) have relaxed rules
- No explicit return types required
- Import ordering not enforced

## Integration with TypeScript

The ESLint configuration works in tandem with `tsconfig.json` strict options:

| TypeScript Option | ESLint Rules |
|-------------------|--------------|
| `noImplicitAny` | `no-explicit-any`, `no-unsafe-*` rules |
| `strictNullChecks` | `no-non-null-assertion`, `strict-boolean-expressions` |
| `noImplicitReturns` | `explicit-function-return-type` |
| `noUnusedLocals` | `no-unused-vars` |

## Running ESLint

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Run both TypeScript and ESLint checks
npm run validate
```

## Common Fixes

### Import Order Issues
Run `npm run lint:fix` to automatically fix import ordering.

### Missing Return Types
Add explicit return types to functions:
```typescript
// Before
function calculate(a: number, b: number) {
  return a + b;
}

// After
function calculate(a: number, b: number): number {
  return a + b;
}
```

### Type-Only Imports
Use inline type imports:
```typescript
// Before
import { User } from './types';
import { validateUser } from './utils';

// After
import { validateUser } from './utils';
import type { User } from './types';

// Or inline
import { validateUser, type User } from './utils';
```

### Floating Promises
Mark fire-and-forget promises with `void`:
```typescript
// Before
fetchData();

// After
void fetchData();
```

### Unsafe Any Assignments
Use type assertions with proper types:
```typescript
// Before
const data: SomeType = await response.json();

// After
const data = await response.json() as SomeType;
```

## Benefits

1. **Type Safety**: Catches potential runtime errors at development time
2. **Consistency**: Enforces consistent coding patterns across the codebase
3. **Maintainability**: Makes code easier to understand and refactor
4. **Documentation**: Explicit types serve as inline documentation
5. **Refactoring Safety**: Type-aware linting helps prevent breaking changes

## Validation Status

✅ ESLint configuration aligned with strict TypeScript
✅ All rules compatible with React/Next.js development
✅ Auto-fixable rules configured where possible
✅ Special considerations for React components included 