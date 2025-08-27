import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores - moved from .eslintignore
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/.vscode/**",
      "**/.idea/**",
      "**/*.log",
      "**/.env*",
      "**/next-env.d.ts",
      "**/coverage/**",
      "**/public/**",
      "**/tsconfig.tsbuildinfo",
      "**/.DS_Store",
    ],
  },
  
  // Next.js recommended config
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // TypeScript specific configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "import": importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // ============================================
      // STRICT TYPESCRIPT RULES
      // ============================================
      
      // Enforce explicit return types (relaxed for React components)
      "@typescript-eslint/explicit-function-return-type": ["error", {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        allowFunctionsWithoutTypeParameters: true,
        allowIIFEs: true,
      }],
      
      // No any types allowed
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      
      // Strict null checks
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      
      // Relaxed boolean expressions for React
      "@typescript-eslint/strict-boolean-expressions": ["error", {
        allowString: true,
        allowNumber: false,
        allowNullableObject: true,
        allowNullableBoolean: true,
        allowNullableString: true,
        allowNullableNumber: false,
        allowAny: false,
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
      }],
      
      // Type imports
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "inline-type-imports",
      }],
      "@typescript-eslint/consistent-type-exports": ["error", {
        fixMixedExportsWithInlineTypeSpecifier: true,
      }],
      
      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "error",
        // Interfaces should be PascalCase
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        // Type aliases should be PascalCase
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        // Enums and their members should be PascalCase
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
      ],
      
      // Prefer readonly
      "@typescript-eslint/prefer-readonly": "error",
      
      // Array types
      "@typescript-eslint/array-type": ["error", {
        default: "array-simple",
        readonly: "array-simple",
      }],
      
      // Promise handling
      "@typescript-eslint/no-floating-promises": ["error", {
        ignoreVoid: true,
        ignoreIIFE: true,
      }],
      "@typescript-eslint/no-misused-promises": ["error", {
        checksVoidReturn: {
          attributes: false,
        },
      }],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/promise-function-async": ["error", {
        allowAny: false,
        checkArrowFunctions: true,
        checkFunctionDeclarations: true,
        checkFunctionExpressions: true,
        checkMethodDeclarations: true,
      }],
      
      // Unused variables
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],
      
      // Type assertions
      "@typescript-eslint/consistent-type-assertions": ["error", {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "allow-as-parameter",
      }],
      
      // Member ordering
      "@typescript-eslint/member-ordering": ["warn", {
        default: [
          // Static fields
          "public-static-field",
          "protected-static-field",
          "private-static-field",
          
          // Instance fields
          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          
          // Constructors
          "constructor",
          
          // Methods
          "public-method",
          "protected-method",
          "private-method",
        ],
      }],
      
      // ============================================
      // IMPORT RULES (Relaxed)
      // ============================================
      
      "import/order": ["warn", {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        warnOnUnassignedImports: false,
      }],
      
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      
      // ============================================
      // GENERAL BEST PRACTICES
      // ============================================
      
      // Enforce return statements in callbacks
      "array-callback-return": "error",
      
      // Require === and !==
      "eqeqeq": ["error", "always"],
      
      // No console logs in production
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // Prefer const
      "prefer-const": "error",
      
      // No var
      "no-var": "error",
      
      // Template literals
      "prefer-template": "warn",
      
      // Object shorthand
      "object-shorthand": ["error", "always"],
      
      // Arrow functions (relaxed for React)
      "prefer-arrow-callback": ["error", {
        allowNamedFunctions: true,
        allowUnboundThis: false,
      }],
      
      // ============================================
      // REACT SPECIFIC
      // ============================================
      
      // These are handled by Next.js config but we can be more strict
      "react/prop-types": "off", // We use TypeScript
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/no-unescaped-entities": "error",
      
      // ============================================
      // DISABLED RULES
      // ============================================
      
      // Disable some rules that conflict with our setup
      "@typescript-eslint/no-empty-interface": "off", // Sometimes empty interfaces are useful
      "@typescript-eslint/no-namespace": "off", // Namespaces can be useful for organizing types
      "import/consistent-type-specifier-style": "off", // Let consistent-type-imports handle this
    },
  },
  
  // Special rules for React components
  {
    files: ["**/*.tsx"],
    rules: {
      // Allow implicit return types for React components
      "@typescript-eslint/explicit-function-return-type": ["error", {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        allowFunctionsWithoutTypeParameters: true,
        allowIIFEs: true,
        allowedNames: [
          // Common React component patterns
          "Component",
          "App",
          "Page",
          "Layout",
          ".*Component",
          ".*Page",
          ".*Layout",
          ".*Provider",
          ".*Context",
          "use.*", // Hooks
        ],
      }],
    },
  },
  
  // Special rules for config files
  {
    files: ["*.config.*", "*.setup.*", "*.test.*", "*.spec.*"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/naming-convention": "off",
      "import/order": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
];

export default eslintConfig;
