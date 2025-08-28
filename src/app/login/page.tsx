'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoginForm } from '@/components/forms/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logComponentError } from '@/services/error.service';
import { useAuthStore } from '@/stores/auth.store';

import type { LoginFormData } from '@/lib/validations/auth';

/**
 * Login page component
 * Provides user authentication functionality with redirect protection
 * @component
 */
export default function LoginPage(): React.ReactElement {
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      logComponentError('Redirecting to dashboard after authentication', 'LoginPage', 'redirect');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle login form submission
  const handleLogin = async (data: LoginFormData): Promise<void> => {
    try {
      logComponentError(`Attempting login with: ${data.email}`, 'LoginPage', 'login');
      await login({
        email: data.email,
        password: data.password,
      });
      logComponentError('Login successful, auth state should update', 'LoginPage', 'login');
      // Redirect will be handled by the useEffect above after login success
    } catch (error) {
      logComponentError(error instanceof Error ? error : new Error('Unknown error'), 'LoginPage', 'login');
      // Let the form handle the error display
      throw error;
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return <div />;
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleLogin} />
            
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link 
                href="/signup" 
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <Link href="#" className="underline-offset-4 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
