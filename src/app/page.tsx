import { Header } from '@/components/header';
import { IssueReportForm } from '@/components/issue-report-form';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Report Civic Issues.
                    <br />
                    Improve Your Community.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Spotted a pothole, a broken streetlight, or overflowing trash? Use CivicLens to report issues directly to your local government. It’s fast, easy, and makes a real difference.
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg lg:p-8">
                <IssueReportForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
