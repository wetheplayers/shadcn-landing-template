import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * Structured Data component for JSON-LD
 */
export function StructuredData({ data }: StructuredDataProps): React.ReactElement {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      strategy="beforeInteractive"
    />
  );
}

/**
 * Organization structured data
 */
export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  email,
  phone,
  address,
  socialProfiles = [],
}: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  socialProfiles?: string[];
}): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    email,
    telephone: phone,
    address: address && {
      '@type': 'PostalAddress',
      ...address,
    },
    sameAs: socialProfiles,
  };

  return <StructuredData data={data} />;
}

/**
 * Website structured data
 */
export function WebsiteSchema({
  name,
  url,
  description,
  searchUrl,
}: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };

  return <StructuredData data={data} />;
}

/**
 * Article structured data
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
}: {
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  url: string;
}): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      ...author,
    },
    publisher: {
      '@type': 'Organization',
      ...publisher,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <StructuredData data={data} />;
}

/**
 * Breadcrumb structured data
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={data} />;
}

/**
 * Product structured data
 */
export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'GBP',
  availability = 'https://schema.org/InStock',
  brand,
  sku,
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  image: string | string[];
  price: string | number;
  currency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
}): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: brand && {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability,
    },
    ...(rating !== undefined && rating !== null && reviewCount !== undefined && reviewCount !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount,
      },
    }),
  };

  return <StructuredData data={data} />;
}

/**
 * FAQ structured data
 */
export function FAQSchema({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}): React.ReactElement {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return <StructuredData data={data} />;
}
