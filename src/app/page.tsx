import type { Metadata } from 'next';
import { IssueReportForm } from '@/components/issue-report-form';
import { LicensingCTA } from '@/components/licensing-cta';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Report Civic Issues — Potholes, Streetlights & More',
  description:
    'Let residents report potholes, broken streetlights, graffiti, and other local issues with an exact map pin and photo upload. CivicLens is the modern 311 alternative for municipalities.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: 'GovernmentApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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
        name: 'What is CivicLens?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CivicLens is a modern civic issue reporting platform that allows residents to report potholes, broken streetlights, graffiti, and other local issues with exact map pins and photo uploads.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I report an issue?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply fill out the report form with a description, drop a pin on the map for the exact location, optionally attach a photo, and submit. The civic team is notified immediately.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can municipalities license CivicLens?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! CivicLens is available for white-label licensing. Contact us to deploy it on your municipal or smart-city platform.',
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    Faster reporting. Cleaner dispatch. Better visibility.
                  </div>
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Report Civic Issues.
                    <br />
                    Improve Your Community.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Spotted a pothole, a broken streetlight, or overflowing trash? Use CivicLens to
                    submit the issue with a photo, address, and exact map pin so the right team can
                    act faster.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-2xl font-bold text-primary">Pinpoint</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Drop an exact map pin instead of vague location notes.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-2xl font-bold text-primary">Upload</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Attach photos that stay available to staff after review.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-2xl font-bold text-primary">Resolve</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Admins can update status, notes, priority, and location from one dashboard.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg lg:p-8">
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
