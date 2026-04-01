import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { IssueReportForm } from '@/components/issue-report-form';
import { LicensingCTA } from '@/components/licensing-cta';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'White-label 311 Software for Modern Civic Teams',
  description:
    'Sell a cleaner civic reporting experience with branded resident intake, precise map pins, photo evidence, and a staff dashboard that keeps issues moving.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const heroPillars = [
    {
      title: 'Resident-first intake',
      description:
        'Turn vague complaints into precise reports with photos, map pins, and clear prompts.',
    },
    {
      title: 'Ops-friendly workflow',
      description:
        'Keep dispatch, status updates, and internal notes inside one admin queue.',
    },
    {
      title: 'Licensable from day one',
      description:
        'White-label the experience instead of funding a long custom build.',
    },
  ];

  const platformCards = [
    {
      icon: Sparkles,
      title: 'Resident experience worth adopting',
      description:
        'A clean, mobile-friendly intake flow makes it easier for people to submit issues correctly the first time.',
      points: ['Exact location pinning', 'Photo evidence upload', 'Simple public-facing workflow'],
    },
    {
      icon: Workflow,
      title: 'Cleaner routing for staff',
      description:
        'Give operations teams one place to triage reports, update priorities, and keep work moving toward resolution.',
      points: ['Central issue queue', 'Priority and status controls', 'Notes and location context together'],
    },
    {
      icon: Building2,
      title: 'Ready for a branded rollout',
      description:
        'Position CivicLens as software your team can license, brand, and put in front of residents quickly.',
      points: ['White-label positioning', 'Buyer-friendly deployment story', 'Fits municipalities, campuses, and portfolios'],
    },
  ];

  const workflowSteps = [
    {
      icon: MapPinned,
      title: 'Residents submit precise reports',
      description: 'Category, description, photo, and exact location capture arrive together.',
    },
    {
      icon: Clock3,
      title: 'Staff triage faster',
      description:
        'The admin queue helps teams prioritize without digging through emails or spreadsheets.',
    },
    {
      icon: CheckCircle2,
      title: 'Work gets tracked visibly',
      description:
        'Statuses, priorities, and internal notes make follow-through easier for operations teams.',
    },
    {
      icon: ShieldCheck,
      title: 'Leadership gets a platform they can stand behind',
      description:
        'The product feels polished enough for residents and structured enough for staff.',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    audience: {
      '@type': 'Audience',
      audienceType: 'Municipal operations teams, campuses, and managed communities',
    },
    author: {
      '@type': 'Person',
      name: siteConfig.creator,
      url: siteConfig.creatorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.publisher,
      url: 'https://codingliquids.com',
    },
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is CivicLens for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CivicLens is built for municipalities, campuses, and managed communities that want a branded civic issue reporting portal paired with a staff-facing operations dashboard.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does the resident reporting flow include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Residents can choose an issue category, add a description, place an exact map pin, include an address, and upload a photo so staff have clearer context from the start.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can organizations license and white-label CivicLens?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. CivicLens is positioned for white-label licensing, so teams can request pricing, implementation guidance, and branding details for their own rollout.',
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />

        <section className="relative overflow-hidden border-b border-white/70 py-14 md:py-20 lg:py-24">
          <div className="absolute inset-0 bg-grid-fade opacity-40" />
          <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
          <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-8">
                <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-white/80 px-4 py-1.5 text-sm font-semibold text-primary shadow-lg shadow-primary/5 backdrop-blur">
                  White-label 311 software for modern civic teams
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl font-headline text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    A modern civic reporting portal people trust and staff can actually run.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                    CivicLens helps municipalities, campuses, and managed communities launch a branded issue-reporting experience with exact map pins, photo evidence, and a staff dashboard built for follow-through.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={siteConfig.contactUrl}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/20 transition-colors hover:bg-primary/90"
                  >
                    Request Pricing and Demo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/#experience"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 text-sm font-medium text-slate-900 backdrop-blur transition-colors hover:bg-white"
                  >
                    See the Resident Workflow
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {heroPillars.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-lg shadow-slate-900/5 backdrop-blur"
                    >
                      <div className="text-sm font-semibold text-slate-950">{pillar.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-5 right-6 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent shadow-lg shadow-accent/10">
                  Built to sell and deploy
                </div>

                <div className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-5">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                        Product Snapshot
                      </div>
                      <h2 className="mt-2 font-headline text-2xl font-bold text-slate-950">
                        Resident intake plus operations visibility
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                        Buyer value
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        One product, two clear audiences
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[28px] border border-primary/10 bg-primary/[0.04] p-5">
                      <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                        Resident portal
                      </div>
                      <div className="mt-4 rounded-3xl border border-white/90 bg-white p-4 shadow-lg shadow-primary/5">
                        <div className="text-sm font-semibold text-slate-950">Broken streetlight</div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          48 Oak Avenue, near the crosswalk. Photo attached and map pin confirmed.
                        </p>
                        <div className="mt-4 grid gap-2 text-sm text-slate-600">
                          <div className="rounded-2xl bg-slate-50 px-3 py-2">Category: Lighting</div>
                          <div className="rounded-2xl bg-slate-50 px-3 py-2">Status after intake: New</div>
                          <div className="rounded-2xl bg-slate-50 px-3 py-2">Evidence: Photo and exact coordinates</div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-900/10 bg-slate-950 p-5 text-white">
                      <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        Staff dashboard
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          {
                            status: 'New',
                            title: 'Pothole near bus stop',
                            meta: 'Priority set for public safety review',
                          },
                          {
                            status: 'Assigned',
                            title: 'Graffiti on retaining wall',
                            meta: 'Crew note added and dispatch routed',
                          },
                          {
                            status: 'Resolved',
                            title: 'Overflowing trash container',
                            meta: 'Closed with field confirmation',
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className="rounded-3xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-semibold">{item.title}</div>
                              <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
                                {item.status}
                              </div>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/65">{item.meta}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      'White-label for your organization',
                      'Designed for resident clarity',
                      'Structured for staff follow-through',
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border/70 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Why buyers say yes faster
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Everything the sale needs, without losing the product substance.
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                The homepage now works as a product pitch: it explains the resident experience, the staff workflow, and the licensing value in one place.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {platformCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-950">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                    <div className="mt-5 space-y-2">
                      {card.points.map((point) => (
                        <div key={point} className="flex items-start gap-3 text-sm text-slate-700">
                          <BadgeCheck className="mt-0.5 h-4 w-4 text-accent" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/70 bg-white/45 py-16 backdrop-blur md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-white/80 px-4 py-1.5 text-sm font-semibold text-slate-700">
                Workflow story
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                From resident report to internal action in one workflow.
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                Prospects do not have to imagine the handoff. The site now shows how the public experience connects to staff operations and why that matters.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {workflowSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="experience" className="py-16 md:py-20 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-6 lg:sticky lg:top-24">
                <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  Resident experience
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Show the workflow clearly, then let buyers try it.
                </h2>
                <p className="text-lg leading-8 text-slate-600">
                  Instead of leading with a generic utility form, the page now frames the reporting flow as part of the product story. Buyers can see exactly what residents experience before asking for pricing.
                </p>

                <div className="space-y-3">
                  {[
                    'The form feels more guided and premium, with better sectioning and clearer prompts.',
                    'Map capture, address entry, and photo upload are easier to scan and understand.',
                    'The call to action stays focused on buying the platform, not just using the demo.',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-lg shadow-slate-900/5 backdrop-blur"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[36px] border border-white/80 bg-white/70 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur md:p-6">
                <IssueReportForm />
              </div>
            </div>
          </div>
        </section>

        <LicensingCTA />
      </main>

      <Footer />
    </div>
  );
}
