'use client';

import { useEffect, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, PencilLine } from 'lucide-react';
import { updateIssueDetails } from '@/lib/actions';
import type { IssuePriority, IssueReport, IssueStatus } from '@/lib/data';
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

const LocationPickerMap = dynamic(() => import('@/components/location-picker-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-[280px] w-full rounded-xl" />,
});

type IssueEditorState = {
  status: IssueStatus;
  priority: IssuePriority;
  reason: string;
  address: string;
  lat: number;
  lng: number;
};

function createInitialState(issue: IssueReport): IssueEditorState {
  return {
    status: issue.status,
    priority: issue.priority,
    reason: issue.reason,
    address: issue.address,
    lat: issue.location.lat,
    lng: issue.location.lng,
  };
}

export function AdminIssueEditor({
  issue,
  onIssueUpdated,
}: {
  issue: IssueReport;
  onIssueUpdated: (issue: IssueReport) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<IssueEditorState>(() => createInitialState(issue));
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFormState(createInitialState(issue));
    }
  }, [issue, open]);

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateIssueDetails({
        id: issue.id,
        status: formState.status,
        priority: formState.priority,
        reason: formState.reason.trim(),
        address: formState.address.trim(),
        lat: formState.lat,
        lng: formState.lng,
      });

      if (!result.success || !result.issue) {
        toast({
          title: 'Update failed',
          description: result.message,
          variant: 'destructive',
        });
        return;
      }

      onIssueUpdated(result.issue);
      setOpen(false);
      toast({
        title: 'Issue updated',
        description: result.message,
      });
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PencilLine className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit report</DialogTitle>
          <DialogDescription>
            Update the workflow status, internal note, address, and map pin for this issue.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`issue-status-${issue.id}`}>Status</Label>
              <Select
                onValueChange={(value) =>
                  setFormState((current) => ({ ...current, status: value as IssueStatus }))
                }
                value={formState.status}
              >
                <SelectTrigger id={`issue-status-${issue.id}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`issue-priority-${issue.id}`}>Priority</Label>
              <Select
                onValueChange={(value) =>
                  setFormState((current) => ({ ...current, priority: value as IssuePriority }))
                }
                value={formState.priority}
              >
                <SelectTrigger id={`issue-priority-${issue.id}`}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`issue-reason-${issue.id}`}>Internal note</Label>
            <Textarea
              id={`issue-reason-${issue.id}`}
              onChange={(event) =>
                setFormState((current) => ({ ...current, reason: event.target.value }))
              }
              placeholder="Why was this priority or status chosen?"
              rows={3}
              value={formState.reason}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`issue-address-${issue.id}`}>Address</Label>
            <Input
              id={`issue-address-${issue.id}`}
              onChange={(event) =>
                setFormState((current) => ({ ...current, address: event.target.value }))
              }
              placeholder="Street address or landmark"
              value={formState.address}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`issue-lat-${issue.id}`}>Latitude</Label>
              <Input
                id={`issue-lat-${issue.id}`}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    lat: Number(event.target.value),
                  }))
                }
                step="0.000001"
                type="number"
                value={Number.isFinite(formState.lat) ? formState.lat : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`issue-lng-${issue.id}`}>Longitude</Label>
              <Input
                id={`issue-lng-${issue.id}`}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    lng: Number(event.target.value),
                  }))
                }
                step="0.000001"
                type="number"
                value={Number.isFinite(formState.lng) ? formState.lng : ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Map pin</Label>
            <LocationPickerMap
              height={280}
              onChange={(coordinates) =>
                setFormState((current) => ({
                  ...current,
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                }))
              }
              value={{ lat: formState.lat, lng: formState.lng }}
            />
            <p className="text-sm text-muted-foreground">
              Click the map or drag the pin to correct the report location.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={isPending} onClick={handleSave} type="button">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
