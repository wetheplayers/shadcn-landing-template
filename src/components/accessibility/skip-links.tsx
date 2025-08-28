'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface SkipLink {
  id: string;
  label: string;
  href: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  {
    id: 'skip-main',
    label: 'Skip to main content',
    href: '#main-content',
  },
  {
    id: 'skip-nav',
    label: 'Skip to navigation',
    href: '#main-navigation',
  },
  {
    id: 'skip-footer',
    label: 'Skip to footer',
    href: '#site-footer',
  },
];

/**
 * Skip links component for accessibility
 * Provides keyboard navigation shortcuts to main page sections
 */
export const SkipLinks = React.memo(function SkipLinks({ 
  links = defaultLinks, 
  className 
}: SkipLinksProps): React.ReactElement {
  return (
    <nav 
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        className
      )}
      aria-label="Skip links"
    >
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              id={link.id}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
