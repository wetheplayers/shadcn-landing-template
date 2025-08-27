import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps {
  className?: string;
  showImage?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
}

/**
 * Loading card skeleton component
 */
export function LoadingCard({
  className = '',
  showImage = true,
  showDescription = true,
  showActions = true,
}: LoadingCardProps): React.ReactElement {
  return (
    <div className={`rounded-lg border bg-card p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          {showImage && (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        {/* Description */}
        {showDescription && (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        )}
      </div>
    </div>
  );
}

interface LoadingListProps {
  count?: number;
  className?: string;
}

/**
 * Loading list skeleton component
 */
export function LoadingList({ count = 5, className = '' }: LoadingListProps): React.ReactElement {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Loading table skeleton component
 */
export function LoadingTable({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: LoadingTableProps): React.ReactElement {
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-muted/50 p-4 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LoadingGridProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Loading grid skeleton component
 */
export function LoadingGrid({ 
  rows = 3, 
  columns = 3, 
  className = '' 
}: LoadingGridProps): React.ReactElement {
  return (
    <div className={`grid gap-4 ${className}`} style={{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    }}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <LoadingCard key={index} showActions={false} />
      ))}
    </div>
  );
}

interface LoadingFormProps {
  fields?: number;
  className?: string;
}

/**
 * Loading form skeleton component
 */
export function LoadingForm({ fields = 4, className = '' }: LoadingFormProps): React.ReactElement {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

interface LoadingProfileProps {
  className?: string;
}

/**
 * Loading profile skeleton component
 */
export function LoadingProfile({ className = '' }: LoadingProfileProps): React.ReactElement {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps): React.ReactElement {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingOverlayProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Loading overlay component
 */
export function LoadingOverlay({ children, className = '' }: LoadingOverlayProps): React.ReactElement {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center space-y-2">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}
