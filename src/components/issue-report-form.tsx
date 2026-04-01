'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFormState, useFormStatus } from 'react-dom';
import { submitIssue, type IssueFormState } from '@/lib/issue-actions';
import { ISSUE_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Loader2, LocateIcon, MapPin, Send, ShieldCheck, Sparkles } from 'lucide-react';

const initialState: IssueFormState = {
  success: false,
  message: '',
  errors: {},
};

const LocationPickerMap = dynamic(() => import('@/components/location-picker-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-[280px] w-full rounded-xl" />,
});

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-full shadow-lg shadow-primary/20"
      disabled={pending}
    >
      {pending ? (
        'Submitting Report...'
      ) : (
        <>
          Send Report to Civic Team
          <Send className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export function IssueReportForm() {
  const [state, formAction] = useFormState(submitIssue, initialState);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setAddress('');
    setCoordinates({ lat: 0, lng: 0 });
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latCoord = position.coords.latitude;
          const lngCoord = position.coords.longitude;
          setCoordinates({
            lat: Number(latCoord.toFixed(6)),
            lng: Number(lngCoord.toFixed(6)),
          });

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latCoord}&lon=${lngCoord}`
            );
            const data = await response.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress(`Near lat: ${latCoord.toFixed(4)}, lng: ${lngCoord.toFixed(4)}`);
            }
          } catch (error) {
            console.error('Reverse geocoding failed', error);
            setAddress(`Near lat: ${latCoord.toFixed(4)}, lng: ${lngCoord.toFixed(4)}`);
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          setDialogTitle('Geolocation Error');
          setDialogDescription(
            'Could not acquire your location. Please check browser permissions and try again.'
          );
          setIsDialogOpen(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setDialogTitle('Geolocation Not Supported');
      setDialogDescription('Your browser does not support geolocation.');
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        setDialogTitle('Success!');
        setDialogDescription(state.message);
        setIsDialogOpen(true);
        resetForm();
      } else {
        setDialogTitle('Submission Error');
        let errorMessages = state.message;
        if (state.errors) {
          const allErrors = Object.values(state.errors).flat();
          if (allErrors.length > 0) {
            errorMessages = allErrors.join('\n');
          }
        }
        setDialogDescription(errorMessages || 'An unknown error occurred.');
        setIsDialogOpen(true);
      }
    }
  }, [state]);

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        encType="multipart/form-data"
        className="space-y-6"
      >
        <div className="rounded-[28px] border border-primary/10 bg-background/90 p-5 shadow-lg shadow-primary/5">
          <div className="inline-flex items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Resident demo
          </div>
          <h2 className="mt-4 font-headline text-2xl font-bold text-foreground">
            Try the reporting experience
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This is the citizen-facing flow buyers see before they license the full platform.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card px-3 py-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="mt-2 text-sm font-medium">Simple intake</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Clean prompts help residents finish the form quickly.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card px-3 py-3">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="mt-2 text-sm font-medium">Exact location</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Maps and coordinates reduce vague location notes.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card px-3 py-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="mt-2 text-sm font-medium">Evidence ready</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Photos give staff context before dispatching work.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-lg shadow-slate-900/5">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select an issue category" />
            </SelectTrigger>
            <SelectContent>
              {ISSUE_CATEGORIES.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state?.errors?.category && (
            <p className="text-sm font-medium text-destructive">{state.errors.category[0]}</p>
          )}
        </div>

        <div className="space-y-2 rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-lg shadow-slate-900/5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="What happened, what should staff know, and what makes it urgent?"
            required
            className="min-h-28"
          />
          {state?.errors?.description && (
            <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>
          )}
        </div>

        <div className="space-y-2 rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-lg shadow-slate-900/5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="Street address, landmark, or intersection"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {state?.errors?.address && (
            <p className="text-sm font-medium text-destructive">{state.errors.address[0]}</p>
          )}
        </div>

        <div className="space-y-3 rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-lg shadow-slate-900/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label>Map Location</Label>
              <p className="text-sm text-muted-foreground">
                Use your current location or click the map to pin the exact issue spot.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGeolocation}
              disabled={isLocating}
              className="rounded-full"
            >
              {isLocating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Locating
                </>
              ) : (
                <>
                  <LocateIcon className="mr-2 h-4 w-4" />
                  Use my location
                </>
              )}
            </Button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/70">
            <LocationPickerMap height={280} onChange={setCoordinates} value={coordinates} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lat-display">Latitude</Label>
              <Input
                id="lat-display"
                onChange={(event) =>
                  setCoordinates((current) => ({
                    ...current,
                    lat: Number(event.target.value),
                  }))
                }
                step="0.000001"
                type="number"
                value={coordinates.lat === 0 ? '' : coordinates.lat}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng-display">Longitude</Label>
              <Input
                id="lng-display"
                onChange={(event) =>
                  setCoordinates((current) => ({
                    ...current,
                    lng: Number(event.target.value),
                  }))
                }
                step="0.000001"
                type="number"
                value={coordinates.lng === 0 ? '' : coordinates.lng}
              />
            </div>
          </div>
          {(state?.errors?.lat || state?.errors?.lng) && (
            <p className="text-sm font-medium text-destructive">
              {state.errors?.lat?.[0] ?? state.errors?.lng?.[0]}
            </p>
          )}
        </div>
        <input type="hidden" name="lat" value={coordinates.lat === 0 ? '' : String(coordinates.lat)} />
        <input type="hidden" name="lng" value={coordinates.lng === 0 ? '' : String(coordinates.lng)} />

        <div className="space-y-2 rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-lg shadow-slate-900/5">
          <Label htmlFor="photo">Photo (Optional)</Label>
          <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-foreground">Add a photo for faster verification</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  A clear image helps staff confirm the issue before dispatching work.
                </p>
                <Input id="photo" name="photo" type="file" accept="image/*" className="bg-background" />
              </div>
            </div>
          </div>
          {state?.errors?.photo && (
            <p className="text-sm font-medium text-destructive">{state.errors.photo[0]}</p>
          )}
        </div>

        <div className="rounded-[28px] border border-primary/10 bg-primary/[0.03] p-5 shadow-lg shadow-primary/5">
          <SubmitButton />
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            Buyers can white-label this flow for their own residents, staff, and operations teams.
          </p>
        </div>
      </form>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
