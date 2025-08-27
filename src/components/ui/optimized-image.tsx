'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { useIntersectionObserverAdvanced } from '@/hooks/use-optimization';
import { LoadingSpinner } from '@/components/ui/loading-states';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

/**
 * Optimized image component with lazy loading and performance features
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  onLoad,
  onError,
  fallbackSrc,
}: OptimizedImageProps): React.ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(priority);
  
  const imageRef = useRef<HTMLImageElement>(null);
  
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserverAdvanced({
    threshold: 0.1,
    rootMargin: '50px',
  });

  // Handle intersection observer
  useEffect(() => {
    if (isIntersecting && !isInView) {
      setIsInView(true);
    }
  }, [isIntersecting, isInView]);

  // Handle error fallback
  const handleError = (): void => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  // Handle successful load
  const handleLoad = (): void => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Combine refs
  const combinedRef = (node: HTMLImageElement | null): void => {
    intersectionRef(node);
    imageRef.current = node;
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Image unavailable</div>
        </div>
      </div>
    );
  }

  if (!isInView) {
    return (
      <div
        className={`bg-muted animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      {/* Image */}
      <Image
        ref={combinedRef}
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lowQualitySrc?: string;
  onLoad?: () => void;
}

/**
 * Progressive image component that loads low quality first, then high quality
 */
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  lowQualitySrc,
  onLoad,
}: ProgressiveImageProps): React.ReactElement {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const [isLowQualityLoaded, setIsLowQualityLoaded] = useState(false);

  const handleHighQualityLoad = (): void => {
    setIsHighQualityLoaded(true);
    onLoad?.();
  };

  const handleLowQualityLoad = (): void => {
    setIsLowQualityLoaded(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Low quality image (background) */}
      {lowQualitySrc && (
        <Image
          src={lowQualitySrc}
          alt={alt}
          width={width}
          height={height}
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHighQualityLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          quality={10}
          onLoad={handleLowQualityLoad}
        />
      )}
      
      {/* High quality image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-500 ${
          isHighQualityLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        quality={90}
        onLoad={handleHighQualityLoad}
      />
    </div>
  );
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: number;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * Responsive image component with automatic sizing
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
  aspectRatio = 16 / 9,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
}: ResponsiveImageProps): React.ReactElement {
  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: aspectRatio.toString() }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        onLoad={onLoad}
      />
    </div>
  );
}
