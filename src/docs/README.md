# TypeScript Documentation

## Overview

This documentation folder contains comprehensive rules and guidelines for writing strict TypeScript code in this project. The rules are designed to be easily digestible by both developers and Large Language Models (LLMs).

## Key Documents

### 1. [TypeScript Rules](./typescript-rules.md)
A comprehensive guide that enforces strict TypeScript and ensures best practices at all times. This document covers:

- **Core Principles**: Mandatory TypeScript usage, no JavaScript allowed
- **Compiler Configuration**: Required tsconfig.json settings for maximum type safety
- **Type System Best Practices**: No 'any' types, strict null checking, exact optional properties
- **Interface and Type Definitions**: When to use interfaces vs type aliases
- **Function Best Practices**: Explicit return types, strict function types
- **Class Best Practices**: Strict property initialization, access modifiers
- **Type Guards and Narrowing**: Custom type guards, discriminated unions
- **Module System**: Import type syntax, module augmentation
- **Error Handling**: Never ignore errors, proper error boundaries
- **Testing Considerations**: Type-safe mocks and test utilities
- **Utility Types**: Essential built-in TypeScript utilities
- **Anti-Patterns to Avoid**: Common mistakes and how to avoid them

### 2. [ESLint TypeScript Rules](./eslint-typescript-rules.md)
Comprehensive ESLint configuration that enforces strict TypeScript best practices, fully aligned with the TypeScript compiler settings.

### 3. [Getting Started](./getting-started.md)
Initial setup guide for the project.

## Quick Reference

### TypeScript Compiler Options

The project uses the strictest possible TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### Key Rules

1. **NO JavaScript** - Only TypeScript (.ts/.tsx) files allowed
2. **NO any types** - Use proper types, generics, or 'unknown'
3. **Explicit return types** - All functions must declare return types
4. **Handle null/undefined** - Proper null checking required
5. **Type imports** - Use `import type` for type-only imports
6. **Error handling** - Never silently fail, always handle errors
7. **Immutability** - Prefer readonly properties and const assertions

## For LLMs

When generating code for this project:

1. **ALWAYS** enable all strict TypeScript options
2. **NEVER** use `any` type
3. **ALWAYS** provide explicit return types
4. **ALWAYS** handle null/undefined cases
5. **PREFER** immutability with `readonly`
6. **USE** discriminated unions for state
7. **IMPLEMENT** proper error boundaries
8. **VALIDATE** external data with type guards
9. **DOCUMENT** complex types with JSDoc
10. **TEST** with type-safe mocks

## Enforcement

The TypeScript compiler is configured to enforce these rules at compile time. Any violation will result in a compilation error, preventing the code from building.

## Updates

This documentation should be updated whenever:
- New TypeScript best practices emerge
- Project-specific patterns are established
- Common issues are identified and solutions documented

Last updated: {{ Date.now() }} 