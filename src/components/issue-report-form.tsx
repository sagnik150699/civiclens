
'use client';

import { useEffect, useState, useRef } from 'react';
import { submitIssue, type IssueFormState } from '@/lib/issue-actions';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Send, LocateIcon, Loader2, Camera } from 'lucide-react';
import { ISSUE_CATEGORIES } from '@/lib/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFormState, useFormStatus } from 'react-dom';
import { Skeleton } from './ui/skeleton';

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
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting Report...' : <>Submit Report <Send className="ml-2 h-4 w-4" /></>}
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
            console.error("Reverse geocoding failed", error);
            setAddress(`Near lat: ${latCoord.toFixed(4)}, lng: ${lngCoord.toFixed(4)}`);
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          setDialogTitle('Geolocation Error');
          setDialogDescription('Could not acquire your location. Please check browser permissions and try again.');
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
      } else if (!state.success) {
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
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold font-headline text-center">Report an Issue</h2>
        
        <div className="space-y-2">
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
            {state?.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category[0]}</p>}
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
                id="description"
                name="description"
                placeholder="Tell us more about the issue..."
                required
            />
            {state?.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
                id="address"
                name="address"
                placeholder="Enter the address or landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            {state?.errors?.address && <p className="text-sm font-medium text-destructive">{state.errors.address[0]}</p>}
        </div>

        <div className="space-y-3">
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

          <LocationPickerMap
            height={280}
            onChange={setCoordinates}
            value={coordinates}
          />

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

        <div className="space-y-2">
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <Input id="photo" name="photo" type="file" accept="image/*" />
            </div>
             {state?.errors?.photo && <p className="text-sm font-medium text-destructive">{state.errors.photo[0]}</p>}
        </div>

        <SubmitButton />
      </form>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
