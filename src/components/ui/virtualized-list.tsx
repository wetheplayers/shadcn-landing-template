import React, { forwardRef } from 'react';

import { useVirtualization } from '@/hooks/use-optimization';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

/**
 * High-performance virtualized list component for large datasets
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className = '',
  onScroll,
}: VirtualizedListProps<T>): React.ReactElement {
  const {
    virtualItems,
    totalSize,
    containerRef,
  } = useVirtualization(items, {
    itemHeight,
    containerHeight,
    overscan,
  });

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    onScroll?.(event.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalSize, position: 'relative' }}>
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
              width: '100%',
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

/**
 * High-performance virtualized grid component
 */
export function VirtualizedGrid<T>({
  items,
  itemHeight,
  itemWidth,
  containerHeight,
  containerWidth,
  overscan = 5,
  renderItem,
  className = '',
}: VirtualizedGridProps<T>): React.ReactElement {
  const itemsPerRow = Math.floor(containerWidth / itemWidth);
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const totalHeight = totalRows * itemHeight;

  const [scrollTop, setScrollTop] = React.useState(0);

  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = React.useMemo(() => {
    const items: Array<{ item: T; index: number; row: number; col: number }> = [];
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < itemsPerRow; col++) {
        const index = row * itemsPerRow + col;
        if (index < items.length) {
          items.push({
            item: items[index],
            index,
            row,
            col,
          });
        }
      }
    }
    
    return items;
  }, [items, startRow, endRow, itemsPerRow]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight, width: containerWidth }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: row * itemHeight,
              left: col * itemWidth,
              height: itemHeight,
              width: itemWidth,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  className?: string;
}

/**
 * Infinite scroll component with performance optimizations
 */
export function InfiniteScroll<T>({
  items,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
  renderItem,
  renderLoading,
  className = '',
}: InfiniteScrollProps<T>): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const loadingRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div ref={containerRef} className={className}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
        <div ref={loadingRef}>
          {isLoading && renderLoading ? (
            renderLoading()
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Loading more...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
