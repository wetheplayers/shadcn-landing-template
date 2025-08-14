import { env } from '@/lib/env';

import type { Metadata } from 'next';


interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: Array<{ name: string; url?: string }>;
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate metadata for Next.js 13+ app directory
 * 
 * @param options - Metadata options
 * @returns Metadata object for Next.js
 */
export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description = 'A modern web application built with Next.js and ShadCN UI',
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = [{ name: 'Your Name' }],
    noindex = false,
    nofollow = false,
  } = options;

  const siteTitle = env.NEXT_PUBLIC_APP_NAME;
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const canonicalUrl = url || env.NEXT_PUBLIC_APP_URL;
  const ogImage = image || `${env.NEXT_PUBLIC_APP_URL}/og-image.png`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors,
    creator: authors[0]?.name,
    publisher: siteTitle,
    
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_GB',
      type: type as 'website' | 'article',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors.map(a => a.name),
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@yourhandle',
      site: '@yoursite',
    },
    
    alternates: {
      canonical: canonicalUrl,
    },
    
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      yahoo: 'yahoo-verification-code',
    },
    
    category: 'technology',
  };
}

/**
 * Default metadata for the application
 */
export const defaultMetadata: Metadata = generateMetadata();

/**
 * Generate article metadata
 */
export function generateArticleMetadata(
  title: string,
  description: string,
  options: Partial<GenerateMetadataOptions> = {}
): Metadata {
  return generateMetadata({
    ...options,
    title,
    description,
    type: 'article',
    publishedTime: options.publishedTime || new Date().toISOString(),
  });
}

/**
 * Generate product metadata
 */
export function generateProductMetadata(
  name: string,
  description: string,
  price: string,
  currency: string = 'GBP',
  image?: string
): Metadata {
  const metadata = generateMetadata({
    title: name,
    description,
    ...(image && { image }),
  });

  // Add product-specific OpenGraph data
  if (metadata.openGraph) {
    (metadata.openGraph as any).type = 'product';
    (metadata.openGraph as any).product = {
      price: {
        amount: price,
        currency,
      },
    };
  }

  return metadata;
}
