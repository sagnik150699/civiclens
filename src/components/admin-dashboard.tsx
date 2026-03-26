
'use client';

import { useMemo, useState, type FC } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IssueReport, IssueStatus, IssuePriority } from '@/lib/data';
import { updateIssueStatus } from '@/lib/actions';
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES, ICONS } from '@/lib/constants';
import { MoreHorizontal, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import dynamic from 'next/dynamic';
import { AdminIssueEditor } from './admin-issue-editor';

const IssueMap = dynamic(() => import('@/components/issue-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});

const priorityColors: Record<IssuePriority, string> = {
  High: 'bg-red-500 hover:bg-red-500/90',
  Medium: 'bg-yellow-500 hover:bg-yellow-500/90',
  Low: 'bg-green-500 hover:bg-green-500/90',
};

const statusColors: Record<IssueStatus, string> = {
  Submitted: 'bg-gray-500',
  Acknowledged: 'bg-blue-500',
  'In Progress': 'bg-purple-500',
  Resolved: 'bg-emerald-500',
};

const StatusBadge: FC<{ status: IssueStatus }> = ({ status }) => (
  <Badge variant="secondary" className={`${statusColors[status]} text-white`}>{status}</Badge>
);

const PriorityBadge: FC<{ priority: IssuePriority }> = ({ priority }) => (
  <Badge className={`${priorityColors[priority]} text-white`}>{priority}</Badge>
);

export function AdminDashboard({ initialIssues }: { initialIssues: IssueReport[] }) {
  const [issues, setIssues] = useState<IssueReport[]>(initialIssues);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const statusMatch = statusFilter === 'all' || issue.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || issue.priority === priorityFilter;
      const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter;
      return statusMatch && priorityMatch && categoryMatch;
    });
  }, [issues, statusFilter, priorityFilter, categoryFilter]);
  
  const handleStatusUpdate = async (id: string, status: IssueStatus) => {
    const result = await updateIssueStatus(id, status);
    if (result.success && result.issue) {
      toast({ title: 'Success', description: result.message });
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === id ? result.issue : issue))
      );
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const handleIssueUpdated = (updatedIssue: IssueReport) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
    );
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button variant="ghost" size="icon" onClick={clearFilters} className="h-6 w-6">
              <ICONS.x className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ISSUE_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setPriorityFilter} value={priorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {ISSUE_PRIORITIES.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCategoryFilter} value={categoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ISSUE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Issue Map</CardTitle>
                <CardDescription>Live map of reported issues.</CardDescription>
            </CardHeader>
            <CardContent>
                <IssueMap issues={filteredIssues} />
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reported Issues</CardTitle>
            <CardDescription>
              Review reports, update workflow details, and correct map pins when needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Internal Note</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => {
                  const CategoryIcon = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.icon || MapPin;
                  const categoryLabel = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.label || issue.category;
                  return (
                  <TableRow key={issue.id}>
                    <TableCell>
                      {issue.photoUrl ? (
                        <a href={issue.photoUrl} target="_blank" rel="noopener noreferrer">
                          <Image src={issue.photoUrl} alt="Issue photo" width={48} height={48} className="rounded-md object-cover" />
                        </a>
                      ) : <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground">n/a</div>}
                    </TableCell>
                    <TableCell><PriorityBadge priority={issue.priority} /></TableCell>
                    <TableCell><StatusBadge status={issue.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{categoryLabel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">{issue.address}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{issue.description}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{issue.reason}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <AdminIssueEditor issue={issue} onIssueUpdated={handleIssueUpdated} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleStatusUpdate(issue.id, 'Acknowledged')}>
                              Acknowledge
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusUpdate(issue.id, 'In Progress')}>
                              Set In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusUpdate(issue.id, 'Resolved')}>
                              Resolve
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredIssues.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No issues match the current filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
