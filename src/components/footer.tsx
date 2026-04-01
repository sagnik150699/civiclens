import { MapPinned } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-card/80 backdrop-blur-sm">
      <div className="container grid gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <div className="font-headline text-lg font-bold">{siteConfig.name}</div>
              <div className="text-sm text-muted-foreground">{siteConfig.tagline}</div>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Branded civic issue reporting for municipalities, campuses, and managed communities.
            Give residents a polished reporting flow and give staff a cleaner queue to manage.
          </p>

          <p className="text-sm text-muted-foreground">
            Copyright {new Date().getFullYear()} {siteConfig.name}. Built by{' '}
            <a
              href={siteConfig.creatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {siteConfig.creator}
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">Explore</div>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/#platform" className="transition-colors hover:text-foreground" prefetch={false}>
              Platform
            </Link>
            <Link href="/#experience" className="transition-colors hover:text-foreground" prefetch={false}>
              Resident Demo
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-foreground" prefetch={false}>
              Request Pricing
            </Link>
            <Link href="/admin" className="transition-colors hover:text-foreground" prefetch={false}>
              Staff Login
            </Link>
          </nav>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-background/80 p-5 shadow-lg shadow-primary/5">
          <div className="text-sm font-semibold text-foreground">Ready to sell the rollout internally?</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Send people to the contact page for pricing, deployment details, and white-label options.
          </p>
          <Button asChild className="mt-4 w-full rounded-full">
            <a href={siteConfig.contactUrl}>Request Pricing</a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
