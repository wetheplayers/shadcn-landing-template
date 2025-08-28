import Link from 'next/link';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Skip Link component for accessibility
 * Allows keyboard users to skip to main content
 */
export function SkipLink({ 
  href = '#main-content', 
  children = 'Skip to main content',
  className = ''
}: SkipLinkProps) {
  return (
    <Link
      href={href}
      className={`
        absolute left-4 top-4 z-50 -translate-y-full rounded-md 
        bg-primary px-4 py-2 text-sm font-medium text-primary-foreground 
        shadow-lg transition-transform duration-200 
        focus:translate-y-0 focus:outline-none focus:ring-2 
        focus:ring-primary focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
