
'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitIssue } from '@/lib/actions';
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytesResumable, getDownloadURL, type UploadTask } from 'firebase/storage';

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
import { Progress } from '@/components/ui/progress';
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

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isUploading;

  return (
    <Button type="submit" className="w-full" disabled={isDisabled}>
      {isUploading && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Image...</>}
      {pending && !isUploading && 'Submitting Report...'}
      {!pending && !isUploading && <>Submit Report <Send className="ml-2 h-4 w-4" /></>}
    </Button>
  );
}

export function IssueReportForm() {
  const [state, formAction, isPending] = useActionState(submitIssue, { success: false, message: '', errors: {} });
  
  const [preview, setPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTaskRef = useRef<UploadTask | null>(null);
  const watchdog = useRef<number | null>(null);
  const lastBytes = useRef<number>(0);

  // Cleanup upload task on component unmount
  useEffect(() => {
    return () => {
      if (uploadTaskRef.current) {
        uploadTaskRef.current.cancel();
      }
      if (watchdog.current) {
        window.clearInterval(watchdog.current);
      }
    };
  }, []);


  const resetForm = () => {
    formRef.current?.reset();
    setPreview(null);
    setPhotoUrl(null);
    setAddress('');
    setLat('');
    setLng('');
    setUploadProgress(0);
    setUploadStatus('idle');
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
                headers: {
                    'User-Agent': 'CivicLens/1.0'
                }
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setDialogTitle('Invalid File Type');
        setDialogDescription('Please select an image file.');
        setIsDialogOpen(true);
        return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setDialogTitle('File Too Large');
        setDialogDescription('Please select an image smaller than 10MB.');
        setIsDialogOpen(true);
        return;
    }

    // Cleanup previous upload artifacts before starting a new one
    uploadTaskRef.current?.cancel();
    if(watchdog.current) window.clearInterval(watchdog.current);

    setPreview(URL.createObjectURL(file));
    setUploadProgress(0);
    setPhotoUrl(null);
    setUploadStatus('running');

    const storageRef = ref(storage, `issues/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTaskRef.current = uploadTask;

    // Watchdog: cancel if bytesTransferred doesn't change for 15s
    watchdog.current = window.setInterval(() => {
        const b = uploadTask.snapshot.bytesTransferred;
        if (b === lastBytes.current && uploadTask.snapshot.state === 'running') {
            console.warn('Upload stuck; canceling');
            uploadTask.cancel();
        }
        lastBytes.current = b;
    }, 15000) as unknown as number;

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            console.log('state:', snapshot.state, snapshot.bytesTransferred, '/', snapshot.totalBytes);
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
        },
        (error) => {
            if (watchdog.current) window.clearInterval(watchdog.current);
            console.error('Storage upload error:', { code: err?.code, message: err?.message });
            setUploadStatus('error');
            setDialogTitle('Upload Error');
            setDialogDescription(`Failed to upload image: ${error.message}`);
            setIsDialogOpen(true);
            setPreview(null);
        },
        () => {
            if (watchdog.current) window.clearInterval(watchdog.current);
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setPhotoUrl(downloadURL);
                setUploadStatus('done');
            });
        }
    );
  };


  useEffect(() => {
    if (isPending) return;

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
  }, [state, isPending]);

  const isUploading = uploadStatus === 'running';

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
            <Select name="category">
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
        <input type="hidden" name="photoUrl" value={photoUrl || ''} />

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
              disabled={isUploading}
            />
            <CameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {state?.errors?.photoUrl && <p className="text-sm font-medium text-destructive">{state.errors.photoUrl[0]}</p>}
        </div>
        
        {uploadStatus !== 'idle' && (
            <div className="space-y-1">
                <Label>Upload progress: {Math.round(uploadProgress)}% ({uploadStatus})</Label>
                <Progress value={uploadProgress} className="w-full" />
            </div>
        )}

        {preview && (
          <div className="relative h-48 w-full">
            <Image
              src={preview}
              alt="Image preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
              data-ai-hint="user uploaded image"
            />
          </div>
        )}

        <SubmitButton isUploading={isUploading} />
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
