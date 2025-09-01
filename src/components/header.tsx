import Link from 'next/link';
import { MountainIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <MountainIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">CivicLens</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button asChild variant="ghost">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Report an Issue
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Admin Dashboard
          </Link>
        </Button>
      </nav>
    </header>
  );
}
