/**
 * Error handling service for consistent error logging and management
 * Provides centralized error handling with proper development/production behavior
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: Date;
  userAgent?: string | undefined;
  url?: string | undefined;
}

export interface ErrorLog {
  message: string;
  stack?: string | undefined;
  context: ErrorContext;
  severity: 'error' | 'warning' | 'info';
}

export class ErrorService {
  private static instance: ErrorService;
  private errorLogs: ErrorLog[] = [];

  private constructor() {}

  static getInstance(): ErrorService {
    if (ErrorService.instance === undefined) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Log an error with proper context and severity
   */
  static log(
    error: Error | string,
    context: Partial<ErrorContext> = {},
    severity: 'error' | 'warning' | 'info' = 'error'
  ): void {
    const errorService = ErrorService.getInstance();
    const errorMessage = error instanceof Error ? error.message : error;
    
    const errorLog: ErrorLog = {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        timestamp: new Date(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        ...context,
      } satisfies ErrorContext,
      severity,
    };

    errorService.errorLogs.push(errorLog);

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      const logMethod = severity === 'error' ? 'error' : severity === 'warning' ? 'warn' : 'log';
      // eslint-disable-next-line no-console
      console[logMethod](`[${severity.toUpperCase()}] ${errorMessage}`, {
        context: errorLog.context,
        stack: errorLog.stack,
      });
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error tracking service integration
      // Example: Sentry, LogRocket, etc.
      ErrorService.sendToErrorTracking(errorLog);
    }
  }

  /**
   * Log an API error with specific context
   */
  static logApiError(
    error: Error | string,
    url: string,
    _method: string,
    _statusCode?: number
  ): void {
    ErrorService.log(error, {
      action: 'api_request',
      url,
      component: 'api_service',
    }, 'error');
  }

  /**
   * Log a component error with context
   */
  static logComponentError(
    error: Error | string,
    componentName: string,
    action?: string
  ): void {
    ErrorService.log(error, {
      component: componentName,
      action: action ?? 'unknown',
    }, 'error');
  }

  /**
   * Get all error logs (for debugging)
   */
  static getErrorLogs(): ErrorLog[] {
    return ErrorService.getInstance().errorLogs;
  }

  /**
   * Clear error logs
   */
  static clearErrorLogs(): void {
    ErrorService.getInstance().errorLogs = [];
  }

  /**
   * Create a user-friendly error message
   */
  static createUserMessage(error: Error | string): string {
    const message = error instanceof Error ? error.message : error;
    
    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'NetworkError': 'Unable to connect to the server. Please check your internet connection.',
      'TimeoutError': 'The request took too long to complete. Please try again.',
      'Unauthorized': 'You are not authorized to perform this action. Please log in again.',
      'Forbidden': 'You do not have permission to access this resource.',
      'NotFound': 'The requested resource was not found.',
      'InternalServerError': 'An unexpected error occurred. Please try again later.',
    };

    // Check for common error patterns
    for (const [pattern, userMessage] of Object.entries(errorMap)) {
      if (message.includes(pattern)) {
        return userMessage;
      }
    }

    // Default user-friendly message
    return 'Something went wrong. Please try again.';
  }

  /**
   * Send error to external tracking service
   */
  private static sendToErrorTracking(_errorLog: ErrorLog): void {
    // TODO: Implement integration with error tracking services
    // Example implementation for Sentry:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(new Error(errorLog.message), {
    //     extra: errorLog.context,
    //   });
    // }
  }
}

// Export convenience functions
export const logError = ErrorService.log;
export const logApiError = ErrorService.logApiError;
export const logComponentError = ErrorService.logComponentError;
export const createUserMessage = ErrorService.createUserMessage;
