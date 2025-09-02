import { Link } from 'next-intl/navigation';
import { MountainIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { cookies } from 'next/headers';
import { getTranslator } from 'next-intl/server';
import { LanguageSwitcher } from './language-switcher';

export async function Header() {
    const cookieStore = cookies();
    const session = cookieStore.get('session');
    const isLoggedIn = !!session?.value;
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    const t = await getTranslator(locale, 'Header');

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
