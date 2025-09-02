'use client';

import { Link } from 'next-intl/navigation';
import { MountainIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { LanguageSwitcher } from './language-switcher';
import { useTranslations } from 'next-intl';

// Note: This component is now a client component to support the next-intl Link.
// We can no longer read cookies directly on the server for the initial render.
// The visibility of the logout button will be handled on the client side based on session state
// or passed down as a prop from a server component if needed.
// For this app's structure, we'll simplify and assume a more robust auth check would be
// implemented in a real-world scenario (e.g., in a provider or layout).
// The middleware will still protect the admin route on the server.

export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
    const t = useTranslations('Header');

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <MountainIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">{t('appName')}</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <LanguageSwitcher />
        <Button asChild variant="ghost">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            {t('reportIssue')}
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            {t('adminDashboard')}
          </Link>
        </Button>
        {isLoggedIn && (
            <form action={logout}>
                <Button type="submit" variant="ghost">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                </Button>
            </form>
        )}
      </nav>
    </header>
  );
}