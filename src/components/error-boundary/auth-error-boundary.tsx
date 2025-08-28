'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for authentication components
 * Provides user-friendly error messages and recovery options
 */
export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AuthErrorBoundaryState> {
    return { 
      hasError: true, 
      error 
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log authentication-specific errors
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // analytics.track('auth_error', { error: error.message, stack: error.stack });
    }
  }

  private readonly handleRetry = (): void => {
    this.setState({ 
      hasError: false, 
      error: null 
    });
  };

  private readonly handleGoToLogin = (): void => {
    window.location.href = '/login';
  };

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">
              Authentication Error
            </CardTitle>
            <CardDescription>
              We encountered an issue with the authentication system. This might be a temporary problem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-mono text-muted-foreground">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} variant="default">
                Try Again
              </Button>
              <Button onClick={this.handleGoToLogin} variant="outline">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
