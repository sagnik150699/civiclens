
'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { submitIssue } from '@/lib/issue-actions';
import { storage } from '@/lib/firebase-client';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
import { Progress } from './ui/progress';
import { useFormStatus } from 'react-dom';
import { Checkbox } from './ui/checkbox';

function SubmitButton({ isUploading, isCaptchaVerified }: { isUploading: boolean, isCaptchaVerified: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isUploading || !isCaptchaVerified;

  return (
    <Button type="submit" className="w-full" disabled={isDisabled}>
      {isUploading && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>}
      {pending && !isUploading && 'Submitting Report...'}
      {!pending && !isUploading && <>Submit Report <Send className="ml-2 h-4 w-4" /></>}
    </Button>
  );
}

export function IssueReportForm() {
  const [state, formAction] = useActionState(submitIssue, { success: false, message: '', errors: {} });
  
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hiddenPhotoUrl, setHiddenPhotoUrl] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setAddress('');
    setLat('');
    setLng('');
    setHiddenPhotoUrl('');
    setUploadStatus('idle');
    setUploadProgress(0);
    setIsCaptchaVerified(false);
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
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        setDialogTitle('Upload Failed');
        setDialogDescription('Only image files are allowed.');
        setIsDialogOpen(true);
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        setDialogTitle('Upload Failed');
        setDialogDescription('File size cannot exceed 10MB.');
        setIsDialogOpen(true);
        return;
    }

    setUploadStatus('running');
    setUploadProgress(0);
    setHiddenPhotoUrl('');

    // Simulate upload
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // Use a random picsum photo for preview
          const randomId = Math.floor(Math.random() * 1000);
          const photoUrl = `https://picsum.photos/seed/${randomId}/600/400`;
          setHiddenPhotoUrl(photoUrl);
          setUploadStatus('done');
        }
      }, 100);
    };

    simulateUpload();
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
        setDialogDescription(state.message || 'An unknown error occurred.');
        setIsDialogOpen(true);
      }
    }
  }, [state]);


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
        <input type="hidden" name="photoUrl" value={hiddenPhotoUrl || ''} />

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
              disabled={uploadStatus === 'running'}
            />
            <CameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {state?.errors?.photoUrl && <p className="text-sm font-medium text-destructive">{state.errors.photoUrl[0]}</p>}
        </div>
        
        {uploadStatus === 'running' && (
          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadStatus === 'done' && hiddenPhotoUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={hiddenPhotoUrl}
              alt="Image preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
              data-ai-hint="user uploaded image"
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

        <SubmitButton isUploading={uploadStatus === 'running'} isCaptchaVerified={isCaptchaVerified} />
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
