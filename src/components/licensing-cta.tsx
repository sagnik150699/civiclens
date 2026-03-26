import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site';

export function LicensingCTA() {
  return (
    <section className="relative overflow-hidden border-t bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Decorative elements */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            For Cities &amp; Platforms
          </div>

          <h2 className="mt-6 font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Want CivicLens on{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              your platform?
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            License CivicLens for your municipality, real-estate portal, or smart-city
            dashboard. White-label ready, API-first, and deployable in days.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="group">
              <a href={`mailto:${siteConfig.licensingEmail}?subject=CivicLens%20Licensing%20Inquiry`}>
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href={siteConfig.creatorUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground/70">
            No commitment required — just tell us about your use case.
          </p>
        </div>
      </div>
    </section>
  );
}
