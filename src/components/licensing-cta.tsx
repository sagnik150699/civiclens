import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, CalendarDays, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site';

export function LicensingCTA() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/70 py-16 md:py-24">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-8 rounded-[32px] border border-slate-900/10 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-900/20 md:px-10 md:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Buy-ready CTA
            </div>

            <h2 className="mt-6 max-w-2xl font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to license CivicLens or discuss an outright acquisition?
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
              CivicLens is proprietary software. Buyers can move forward through a written
              commercial license for a branded rollout or explore an outright purchase of the
              platform.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Building2,
                  title: 'White-label rollout',
                  description: 'Match your organization, domain, and resident-facing launch plan.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Operational control',
                  description: 'Keep triage, statuses, notes, and priorities in one place.',
                },
                {
                  icon: BadgeCheck,
                  title: 'Commercial clarity',
                  description: 'Discuss licensing terms, acquisition options, and implementation scope.',
                },
                {
                  icon: CalendarDays,
                  title: 'Implementation planning',
                  description: 'Review hosting, branding, deployment, and rollout requirements early.',
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <p className="mt-1 text-sm leading-6 text-white/65">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
              What to ask for
            </div>

            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                Pricing for a licensed rollout or terms for an outright acquisition
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                Branding, hosting, deployment, and admin workflow requirements
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                Implementation guidance and procurement support for internal approval
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href={siteConfig.contactUrl}>
                  Request Pricing and Terms
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href={siteConfig.contactUrl}>Book a Product Walkthrough</a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="h-12 rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/#experience">See the Resident Experience</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm leading-6 text-white/60">
              Proprietary software. Available only by written commercial license or outright
              acquisition.
            </p>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Prefer direct outreach? Visit{' '}
              <a
                className="font-medium text-white underline underline-offset-4"
                href={siteConfig.contactUrl}
              >
                sagnikbhattacharya.com/contact
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
