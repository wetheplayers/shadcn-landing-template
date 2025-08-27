import { z } from 'zod';

/**
 * Server-side environment variables schema
 * These are only available on the server
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Database
  DATABASE_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  
  // OAuth Providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number()).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  
  // External APIs
  API_KEY: z.string().optional(),
  API_SECRET: z.string().optional(),
  
  // Analytics (optional)
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),
});

/**
 * Client-side environment variables schema
 * These are exposed to the browser (must be prefixed with NEXT_PUBLIC_)
 */
const clientSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('ShadCN Next.js App'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.1.0'),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  NEXT_PUBLIC_ENABLE_PWA: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_TIMEOUT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default('30000'),
  
  // Third-party Services
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

/**
 * Merged schema for all environment variables
 */
const processEnvSchema = serverSchema.merge(clientSchema);

/**
 * Type definitions
 */
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type ProcessEnv = z.infer<typeof processEnvSchema>;

/**
 * Validate and parse environment variables
 */
const parsed = (() => {
  try {
    return processEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = error.errors
        .map((err) => {
          const path = err.path.join('.');
          return `  ❌ ${path}: ${err.message}`;
        })
        .join('\n');
      
      const message = `
🔴 Invalid environment variables detected:
${formatted}

💡 Please check your .env files and ensure all required variables are set correctly.
`;
      
      // In development, log the error but don't crash
      if (process.env.NODE_ENV === 'development') {
        console.error(message);
        // Return defaults where possible
        return {
          ...serverSchema.parse({}),
          ...clientSchema.parse({}),
        } satisfies ProcessEnv;
      }
      
      // In production, throw to prevent deployment
      throw new Error(message);
    }
    throw error;
  }
})();

/**
 * Validated environment variables
 * Use this throughout your application
 */
export const env = parsed;

/**
 * Type-safe environment variable access
 */
export const serverEnv: ServerEnv = parsed;
export const clientEnv: ClientEnv = parsed;

/**
 * Helper to check if we're in a specific environment
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

/**
 * Helper to get public runtime config
 * Safe to use in client components
 */
export function getPublicConfig(): ClientEnv {
  return {
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_ENABLE_ANALYTICS: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_PWA: env.NEXT_PUBLIC_ENABLE_PWA,
    NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_TIMEOUT: env.NEXT_PUBLIC_API_TIMEOUT,
    NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: env.NEXT_PUBLIC_POSTHOG_HOST,
  };
}
