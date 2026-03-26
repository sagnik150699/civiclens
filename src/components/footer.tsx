import { MapPinned } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t bg-card/60 backdrop-blur-sm">
      <div className="container flex flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between md:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinned className="h-4 w-4 text-primary" />
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Built by{' '}
            <a
              href={siteConfig.creatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {siteConfig.creator}
            </a>
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
            prefetch={false}
          >
            Report an Issue
          </Link>
          <Link
            href="/admin"
            className="transition-colors hover:text-foreground"
            prefetch={false}
          >
            Staff Login
          </Link>
        </nav>
      </div>
    </footer>
  );
}
