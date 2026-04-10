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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'White-label 311 Software for Modern Civic Teams',
  description:
    'License or acquire CivicLens outright: a proprietary white-label 311 platform with branded resident intake, map pins, photo evidence, and a staff dashboard for civic teams.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const faqs = [
    {
      question: 'Who is CivicLens for?',
      answer:
        'CivicLens is built for municipalities, campuses, and managed communities that need a branded civic issue reporting portal paired with a staff-facing operations dashboard.',
    },
    {
      question: 'What does the resident reporting workflow include?',
      answer:
        'Residents can choose an issue category, add a description, place an exact map pin, include an address, and upload a photo so staff receive clearer context from the start.',
    },
    {
      question: 'How is CivicLens delivered to buyers?',
      answer:
        'Buyers can license CivicLens as a white-label deployment with their branding, domain, and rollout requirements. Deployment, hosting expectations, and implementation planning are handled as part of the commercial conversation.',
    },
    {
      question: 'Can organizations license CivicLens or buy it outright?',
      answer:
        'Yes. CivicLens is proprietary software owned by Sagnik Bhattacharya and is available only through a written commercial license or a separate outright acquisition agreement.',
    },
    {
      question: 'What happens after requesting pricing?',
      answer:
        'The next step is a conversation about organization size, deployment model, branding needs, implementation scope, and whether licensing or outright acquisition is the right fit.',
    },
  ];

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
        'License the platform for rollout or discuss an outright acquisition.',
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
      title: 'Commercially ready ownership path',
      description:
        'CivicLens is proprietary software with a clear path for commercial licensing or a negotiated outright purchase.',
      points: [
        'White-label deployment options',
        'Licensing or acquisition terms',
        'Fits municipalities, campuses, and portfolios',
      ],
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
        'The product pairs operational value with clear deployment, ownership, and rollout options.',
    },
  ];

  const softwareApplicationData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteConfig.url}#software`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    isAccessibleForFree: false,
    audience: {
      '@type': 'Audience',
      audienceType: 'Municipal operations teams, campuses, and managed communities',
    },
    creator: {
      '@type': 'Person',
      name: siteConfig.creator,
      url: siteConfig.creatorUrl,
    },
    publisher: {
      '@id': `${siteConfig.url}#organization`,
    },
    provider: {
      '@id': `${siteConfig.url}#organization`,
    },
    featureList: [
      'Branded resident issue reporting portal',
      'Photo-backed intake with exact map pin capture',
      'Staff dashboard for triage, status updates, and notes',
      'White-label deployment planning for buyer organizations',
    ],
    offers: {
      '@type': 'Offer',
      url: siteConfig.contactUrl,
      description: 'Commercial licensing and outright acquisition are available by written agreement.',
      category: 'Commercial software',
    },
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.publisher,
    url: siteConfig.publisherUrl,
    founder: {
      '@type': 'Person',
      name: siteConfig.creator,
      url: siteConfig.creatorUrl,
    },
    email: siteConfig.contactEmail,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.contactEmail,
        url: siteConfig.contactUrl,
        availableLanguage: ['English'],
      },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
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
                    CivicLens gives municipalities, campuses, and managed communities a branded
                    reporting portal, photo-backed intake, and a staff dashboard they can license
                    for deployment or acquire outright.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={siteConfig.contactUrl}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/20 transition-colors hover:bg-primary/90"
                  >
                    Request Pricing and Terms
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/#experience"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 text-sm font-medium text-slate-900 backdrop-blur transition-colors hover:bg-white"
                  >
                    See the Resident Workflow
                  </Link>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  Proprietary software available only by written commercial license or outright
                  acquisition.
                </p>

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
                Buyers can evaluate resident experience, staff workflow, deployment fit, and
                commercial ownership options from one page.
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
                The handoff is clear from intake to resolution, which helps buyers assess
                operational fit, deployment expectations, and internal rollout readiness faster.
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
                  Buyers can review the resident workflow in detail, validate the intake
                  experience, and assess how the platform would fit a branded rollout before
                  discussing pricing.
                </p>

                <div className="space-y-3">
                  {[
                    'Guided intake captures category, address, map pin, and photo in one flow.',
                    'Staff receive clearer context, which reduces back-and-forth during triage.',
                    'Commercial terms stay clear: license CivicLens or discuss an outright acquisition.',
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

        <section id="faq" className="border-t border-white/70 py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Licensing FAQ
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Ownership, deployment, and rollout questions answered plainly.
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                These are the questions buyers usually ask before a licensing conversation or an
                outright acquisition review.
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-10 space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="rounded-[28px] border border-white/80 bg-white/85 px-6 shadow-lg shadow-slate-900/5 backdrop-blur"
                >
                  <AccordionTrigger className="py-5 text-left text-lg font-bold text-slate-950 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-8 text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <LicensingCTA />
      </main>

      <Footer />
    </div>
  );
}
