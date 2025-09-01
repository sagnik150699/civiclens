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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
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
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES, ICONS } from '@/lib/constants';
import { MoreHorizontal, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { updateIssueStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


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
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setIssues(prevIssues => 
        prevIssues.map(issue => 
          issue.id === id ? { ...issue, status } : issue
        )
      );
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  }


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
                  <SelectItem key={status} value={status}>{status}</SelectItem>
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
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
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
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
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
                <div className="relative h-64 w-full overflow-hidden rounded-md">
                    <Image
                        src="https://picsum.photos/800/400"
                        alt="City map with issue locations"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="city map"
                    />
                    {filteredIssues.map(issue => {
                         const Icon = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.icon || MapPin;
                         const top = 10 + (issue.location.lat - 34.0) * 1000;
                         const left = 10 + (issue.location.lng - (-118.3)) * 1000;
                         return (
                            <TooltipProvider key={issue.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div 
                                          className="absolute -translate-x-1/2 -translate-y-1/2"
                                          style={{ top: `${top % 90 + 5}%`, left: `${left % 90 + 5}%` }}
                                        >
                                           <Icon className={`h-6 w-6 ${priorityColors[issue.priority]} text-white rounded-full p-1 shadow-lg`}/>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{issue.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                         )
                    })}
                </div>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reported Issues</CardTitle>
            <CardDescription>
              A list of all issues reported by citizens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => {
                  const CategoryIcon = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.icon || MapPin;
                  return (
                  <TableRow key={issue.id}>
                    <TableCell><PriorityBadge priority={issue.priority} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{ISSUE_CATEGORIES.find(c => c.value === issue.category)?.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{issue.address}</TableCell>
                    <TableCell className="max-w-xs truncate">{issue.description}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell><StatusBadge status={issue.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(issue.id, 'Acknowledged')}>Acknowledge</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(issue.id, 'In Progress')}>Set In Progress</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleStatusUpdate(issue.id, 'Resolved')}>Resolve</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
