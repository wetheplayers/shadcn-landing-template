'use client';

import React, { Component, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorInfo {
  componentStack: string;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error boundary component for catching React errors
 * Provides fallback UI and error reporting capabilities
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription>
                We&apos;re sorry for the inconvenience. The application encountered an unexpected error.
                {this.state.errorId !== null && (
                  <span className="block mt-2 text-xs text-muted-foreground">
                    Error ID: {this.state.errorId}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error !== null && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-mono text-muted-foreground">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo !== null && (
                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default">
                  Try again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                >
                  Go to homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Report to external error tracking service (if configured)
    this.reportError(error, errorInfo);
  }

  override componentDidUpdate(prevProps: Props): void {
    // Reset error state when resetKeys change
    if (prevProps.resetKeys !== this.props.resetKeys) {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        errorId: null 
      });
    }
  }

  private readonly handleReset = (): void => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  private readonly reportError = (error: Error, errorInfo: ErrorInfo): void => {
    // In a real application, you would send this to your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      console.error('Error reported to tracking service:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  };
}

/**
 * Hook to wrap async components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for functional components to handle errors
 */
export function useErrorHandler() {
  return {
    handleError: (error: Error, errorInfo?: ErrorInfo) => {
      console.error('Error caught by useErrorHandler:', error, errorInfo);
      
      // In production, report to error tracking service
      if (process.env.NODE_ENV === 'production') {
        console.error('Error reported to tracking service:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo?.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
      }
    },
  };
}
