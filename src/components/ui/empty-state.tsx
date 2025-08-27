import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  } | undefined;
  className?: string | undefined;
}

/**
 * Empty state component for when there's no data
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      {icon !== undefined && icon !== null && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold">{title}</h3>
      
      {description !== undefined && description !== null && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {action !== undefined && action !== null && (
        <Button
          onClick={action.onClick}
          className="mt-6"
          variant="outline"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Error state component for when something goes wrong
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  retry,
  className,
}: ErrorStateProps): React.ReactElement {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <svg
        className="mb-4 h-12 w-12 text-destructive"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      
      {retry !== undefined && retry !== null && (
        <Button
          onClick={retry}
          className="mt-6"
          variant="outline"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

/**
 * No results state for search/filter
 */
interface NoResultsProps {
  searchTerm?: string;
  onClear?: () => void;
  className?: string;
}

export function NoResults({
  searchTerm,
  onClear,
  className,
}: NoResultsProps): React.ReactElement {
  return (
    <EmptyState
      icon={
        <svg
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No results found"
      description={
        searchTerm
          ? `No results found for "${searchTerm}". Try adjusting your search.`
          : 'No results match your current filters.'
      }
      action={
        onClear
          ? {
              label: 'Clear filters',
              onClick: onClear,
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * Offline state component
 */
export function OfflineState({ 
  className 
}: { 
  className?: string 
}): React.ReactElement {
  return (
    <EmptyState
      icon={
        <svg
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      }
      title="You're offline"
      description="Please check your internet connection and try again."
      className={className}
    />
  );
}
