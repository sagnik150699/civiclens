import Link from 'next/link';
import { ArrowRight, LogOut, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { siteConfig } from '@/lib/site';

export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" prefetch={false}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <MapPinned className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-headline text-lg font-bold leading-none text-foreground">
              {siteConfig.name}
            </div>
            <div className="hidden truncate text-xs text-muted-foreground sm:block">
              {siteConfig.tagline}
            </div>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          <Link
            href="/#platform"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            prefetch={false}
          >
            Platform
          </Link>
          <Link
            href="/#experience"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            prefetch={false}
          >
            Resident Demo
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            prefetch={false}
          >
            Pricing
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/admin" prefetch={false}>
              {isLoggedIn ? 'Dashboard' : 'Staff Login'}
            </Link>
          </Button>
          <Button asChild className="rounded-full px-5 shadow-lg shadow-primary/20">
            <a href={siteConfig.contactUrl}>
              Request Pricing
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          {isLoggedIn && (
            <form action={logout}>
              <Button type="submit" variant="ghost" size="icon" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
