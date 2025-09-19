
'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { submitIssue } from '@/lib/issue-actions';

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
import Image from 'next/image';
import { CameraIcon, Send, LocateIcon, Loader2 } from 'lucide-react';
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
import { useFormStatus } from 'react-dom';
import { Checkbox } from './ui/checkbox';
import type { IssueFormState } from '@/lib/issue-actions';

const initialState: IssueFormState = {
    success: false,
    message: '',
    errors: {}
};

function SubmitButton({ isCaptchaVerified }: { isCaptchaVerified: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || !isCaptchaVerified;

  return (
    <Button type="submit" className="w-full" disabled={isDisabled}>
      {pending ? 'Submitting Report...' : <>Submit Report <Send className="ml-2 h-4 w-4" /></>}
    </Button>
  );
}

export function IssueReportForm() {
  const [state, formAction] = useActionState(submitIssue, initialState);
  
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const existingPhotoUrlRef = useRef<string | null>(null);


  const resetForm = () => {
    formRef.current?.reset();
    setAddress('');
    setLat('');
    setLng('');
    setPhotoUrl('');
    setIsCaptchaVerified(false);
    
    if (existingPhotoUrlRef.current) {
        URL.revokeObjectURL(existingPhotoUrlRef.current);
        existingPhotoUrlRef.current = null;
    }
    const captchaCheckbox = document.getElementById('captcha') as HTMLInputElement;
    if (captchaCheckbox) captchaCheckbox.checked = false;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latCoord = position.coords.latitude;
          const lngCoord = position.coords.longitude;
          setLat(latCoord.toString());
          setLng(lngCoord.toString());

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCoord}&lon=${lngCoord}`, {
                headers: { 'User-Agent': 'CivicLens/1.0' }
            });
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
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (existingPhotoUrlRef.current) {
        URL.revokeObjectURL(existingPhotoUrlRef.current);
    }
    
    const file = e.target.files?.[0];
    if (!file) {
        setPhotoUrl('');
        existingPhotoUrlRef.current = null;
        return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPhotoUrl(objectUrl);
    existingPhotoUrlRef.current = objectUrl;
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

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
        if (existingPhotoUrlRef.current) {
            URL.revokeObjectURL(existingPhotoUrlRef.current);
        }
    }
  }, [])


  return (
    <>
      <form
        ref={formRef}
        action={formAction}
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
            <div className="relative">
                <Input
                    id="address"
                    name="address"
                    placeholder="Enter the address or use geolocation"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleGeolocation}
                    disabled={isLocating}
                >
                    {isLocating ? (
                        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    ) : (
                        <LocateIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                </Button>
            </div>
            {state?.errors?.address && <p className="text-sm font-medium text-destructive">{state.errors.address[0]}</p>}
        </div>
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />

        <div className="space-y-2">
          <Label htmlFor="photo">Photo (Optional)</Label>
          <div className="relative">
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="pl-10"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <CameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {state?.errors?.photo && <p className="text-sm font-medium text-destructive">{state.errors.photo[0]}</p>}
        </div>
        
        {photoUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={photoUrl}
              alt="Image preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox id="captcha" onCheckedChange={(checked) => setIsCaptchaVerified(checked as boolean)} />
          <Label
            htmlFor="captcha"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I am not a robot
          </Label>
        </div>

        <SubmitButton isCaptchaVerified={isCaptchaVerified} />
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
