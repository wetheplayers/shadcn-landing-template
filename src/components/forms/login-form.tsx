'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
}

/**
 * Login form component with validation
 */
export function LoginForm({ onSubmit }: LoginFormProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const handleSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call the provided onSubmit handler or default logic
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default: log the data (replace with actual auth logic)
        // TODO: Replace with actual authentication logic
        // console.log('Login data:', data);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        alert('Login successful!');
      }
      
      // Reset form on success
      form.reset();
    } catch (error) {
      // Log error for debugging (remove in production)
      console.error('Login failed:', error);
      
      // Set form error
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Enter your email address to sign in
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer">
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="px-0"
            disabled={isLoading}
          >
            Forgot password?
          </Button>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
