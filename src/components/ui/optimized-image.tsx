"use client"

import Image from 'next/image';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  size: number;
}

/**
 * Optimized image component with lazy loading, blur placeholder, and performance optimizations
 * Provides progressive image loading with low-quality placeholders
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const intersectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    const currentRef = intersectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // If priority is true, load immediately
  const shouldLoad = priority || isInView;

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{
          width: width !== null && width !== undefined ? `${width}px` : '100%',
          height: height !== null && height !== undefined ? `${height}px` : '200px',
        }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  if (!shouldLoad) {
    return (
      <div
        ref={intersectionRef}
        className={cn(
          'bg-muted animate-pulse',
          className
        )}
        style={{
          width: width !== null && width !== undefined ? `${width}px` : '100%',
          height: height !== null && height !== undefined ? `${height}px` : '200px',
        }}
      />
    );
  }

  if (fill) {
    return (
      <div className={cn('relative', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes !== null && sizes !== undefined ? sizes : '100vw'}
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          quality={quality}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={placeholder}
          {...(blurDataURL !== null && blurDataURL !== undefined && { blurDataURL })}
        />
      </div>
    );
  }

  // Ensure width and height are defined for non-fill images
  if (width === null || height === null || width === 0 || height === 0 || Number.isNaN(width) || Number.isNaN(height)) {
    console.warn('OptimizedImage: width and height are required when fill is false');
    return null;
  }

  return (
    <div className={cn('relative', className)}>
            {/* Low quality placeholder */}
      {placeholder === 'blur' && blurDataURL !== null && blurDataURL !== undefined && (
        <Image
          src={blurDataURL as string}
          alt={alt}
          width={width as number}
          height={height as number}
          className={cn(
            'absolute inset-0 object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          quality={10}
          priority={false}
        />
      )}

      {/* Main image */}
      <Image
        src={src}
        alt={alt}
        width={width as number}
        height={height as number}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={placeholder}
        {...(blurDataURL !== null && blurDataURL !== undefined && { blurDataURL })}
      />
    </div>
  );
};

/**
 * Virtualized image list component for performance optimization
 * Renders only visible images to improve performance with large lists
 */
interface VirtualizedImageListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualizedImageList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualizedImageListProps<T>): React.ReactElement {
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

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>): void => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          if (item === null || item === undefined) return null;
          
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
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OptimizedImage;
