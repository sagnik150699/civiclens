import { AdminDashboard } from '@/components/admin-dashboard';
import { getIssues } from '@/lib/actions';

export default async function AdminPage() {
  const issues = await getIssues();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold font-headline">Admin Dashboard</h1>
        </div>
        <AdminDashboard initialIssues={issues} />
      </main>
    </div>
  );
}
