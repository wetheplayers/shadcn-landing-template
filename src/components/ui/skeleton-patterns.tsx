import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton for card component
 */
export function CardSkeleton(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for user profile
 */
export function UserProfileSkeleton(): React.ReactElement {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/**
 * Skeleton for table rows
 */
export function TableRowSkeleton({ 
  columns = 4 
}: { 
  columns?: number 
}): React.ReactElement {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for list items
 */
export function ListItemSkeleton(): React.ReactElement {
  return (
    <div className="flex items-center space-x-3 p-4">
      <Skeleton className="h-10 w-10 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Skeleton for article/blog post
 */
export function ArticleSkeleton(): React.ReactElement {
  return (
    <article className="space-y-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  );
}

/**
 * Skeleton for navigation menu
 */
export function NavigationSkeleton(): React.ReactElement {
  return (
    <nav className="flex items-center space-x-6 p-4">
      <Skeleton className="h-8 w-8" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-20" />
      ))}
    </nav>
  );
}

/**
 * Skeleton for form fields
 */
export function FormFieldSkeleton(): React.ReactElement {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

/**
 * Skeleton for stats/metrics card
 */
export function StatCardSkeleton(): React.ReactElement {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for grid layout
 */
export function GridSkeleton({ 
  items = 6,
  columns = 3 
}: { 
  items?: number;
  columns?: number;
}): React.ReactElement {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
