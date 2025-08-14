import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps): React.ReactElement {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-b-2 border-primary',
          sizeClasses[size]
        )}
      />
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

/**
 * Loading dots animation
 */
export function LoadingDots({ className }: LoadingDotsProps): React.ReactElement {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

/**
 * Full screen loading overlay
 */
export function LoadingOverlay({ 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps): React.ReactElement {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}

interface LoadingBarProps {
  progress?: number;
  className?: string;
}

/**
 * Loading progress bar
 */
export function LoadingBar({ 
  progress, 
  className 
}: LoadingBarProps): React.ReactElement {
  const isIndeterminate = progress === undefined;

  return (
    <div
      className={cn(
        'relative h-1 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
    >
      <div
        className={cn(
          'h-full bg-primary transition-all',
          isIndeterminate && 'animate-[shimmer_2s_infinite]'
        )}
        style={{
          width: isIndeterminate ? '30%' : `${progress}%`,
          transform: isIndeterminate ? 'translateX(-100%)' : undefined,
        }}
      />
    </div>
  );
}
