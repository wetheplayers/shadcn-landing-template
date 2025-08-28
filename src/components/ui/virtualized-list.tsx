"use client"

import React, { useState, useRef, useCallback } from 'react';

import { cn } from '@/lib/utils';

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  hasMore?: boolean;
  isLoading?: boolean;
}

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number, row: number, col: number) => React.ReactNode;
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth: number;
  overscan?: number;
  className?: string;
}

/**
 * Virtualized list component for performance optimization
 * Renders only visible items to improve performance with large lists
 */
export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  className,
  onEndReached,
  onEndReachedThreshold = 0.8,
  hasMore = false,
  isLoading = false,
}: VirtualizedListProps<T>): React.ReactElement {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems: VirtualItem[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
      end: (i + 1) * itemHeight,
      size: itemHeight,
    });
  }

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop: newScrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setScrollTop(newScrollTop);

    // Check if we've reached the end
    if (onEndReached && hasMore && !isLoading) {
      const scrollPercentage = (newScrollTop + clientHeight) / scrollHeight;
      if (scrollPercentage >= onEndReachedThreshold) {
        onEndReached();
      }
    }
  }, [onEndReached, hasMore, isLoading, onEndReachedThreshold]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          if (item === null) return null;
          
          return (
            <div
              key={virtualItem.index}
              style={{
                position: 'absolute',
                top: virtualItem.start,
                height: virtualItem.size,
                width: '100%',
              }}
            >
              {renderItem(item as T, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Virtualized grid component for performance optimization
 * Renders only visible grid items to improve performance with large grids
 */
export function VirtualizedGrid<T>({
  items,
  renderItem,
  itemHeight,
  itemWidth,
  containerHeight,
  containerWidth,
  overscan = 5,
  className,
}: VirtualizedGridProps<T>): React.ReactElement {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const columnsPerRow = Math.floor(containerWidth / itemWidth);
  const rows = Math.ceil(items.length / columnsPerRow);
  const totalHeight = rows * itemHeight;
  const totalWidth = columnsPerRow * itemWidth;

  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endRow = Math.min(
    rows - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const startCol = Math.max(0, Math.floor(scrollLeft / itemWidth) - overscan);
  const endCol = Math.min(
    columnsPerRow - 1,
    Math.ceil((scrollLeft + containerWidth) / itemWidth) + overscan
  );

  const visibleItems: Array<{ item: T; index: number; row: number; col: number }> = [];
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const index = row * columnsPerRow + col;
      const item = items[index];
      
      if (item !== null) {
        visibleItems.push({
          item: item as T,
          index,
          row,
          col,
        });
      }
    }
  }

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollLeft(event.currentTarget.scrollLeft);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight, width: containerWidth }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, width: totalWidth, position: 'relative' }}>
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={`${row}-${col}`}
            style={{
              position: 'absolute',
              top: row * itemHeight,
              left: col * itemWidth,
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItem(item, index, row, col)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook for managing virtualized list state
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
): {
  virtualItems: VirtualItem[];
  totalHeight: number;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollTop: number;
} {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems: VirtualItem[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
      end: (i + 1) * itemHeight,
      size: itemHeight,
    });
  }

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    handleScroll,
    scrollTop,
  };
}
