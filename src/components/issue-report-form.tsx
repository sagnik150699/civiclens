
'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitIssue } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

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
import { CameraIcon, Send, LocateIcon } from 'lucide-react';
import { ISSUE_CATEGORIES } from '@/lib/constants';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Report'}
      <Send className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function IssueReportForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(submitIssue, undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latCoord = position.coords.latitude;
          const lngCoord = position.coords.longitude;
          setLat(latCoord.toString());
          setLng(lngCoord.toString());

          // Reverse geocode to get address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCoord}&lon=${lngCoord}`);
            const data = await response.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress(`Near lat: ${latCoord.toFixed(4)}, lng: ${lngCoord.toFixed(4)}`);
            }
          } catch (error) {
            console.error("Reverse geocoding failed", error);
            setAddress(`Near lat: ${latCoord.toFixed(4)}, lng: ${lngCoord.toFixed(4)}`);
          }
          
          toast({
            title: "Location Acquired",
            description: "Your current location has been set.",
          });
        },
        () => {
          toast({
            title: "Geolocation Error",
            description: "Could not acquire your location. Please enter your address manually.",
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: 'destructive',
      });
    }
  };

  const resetCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  };

  useEffect(() => {
    resetCaptcha();
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
      });
      formRef.current?.reset();
      setPreview(null);
      setAddress('');
      setLat('');
      setLng('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      resetCaptcha();
    } else if (state?.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
       // Keep form data but generate a new captcha
       resetCaptcha();
    }
  }, [state, toast]);

  return (
      <form
        ref={formRef}
        action={formAction}
        className="space-y-4"
        key={num1 + num2} // Use key to help React re-render captcha
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
                />
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={handleGeolocation}
                >
                    <LocateIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
            {state?.errors?.address && <p className="text-sm font-medium text-destructive">{state.errors.address[0]}</p>}
        </div>
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />

        <div className="space-y-2">
          <Label htmlFor="photo">Photo</Label>
          <div className="relative">
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="pl-10"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setPreview(null);
                }
              }}
            />
            <CameraIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {state?.errors?.photo && <p className="text-sm font-medium text-destructive">{state.errors.photo[0]}</p>}
        </div>
        
        {preview && (
          <div className="relative h-48 w-full">
            <Image
              src={preview}
              alt="Image preview"
              fill
              objectFit="cover"
              className="rounded-md"
              data-ai-hint="user uploaded image"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="captcha">
            Security Question: What is {num1} + {num2}?
          </Label>
          <Input id="captcha" name="captcha" placeholder="Your answer" />
          {state?.errors?.captcha && <p className="text-sm font-medium text-destructive">{state.errors.captcha[0]}</p>}
        </div>
        <input type="hidden" name="captchaQuestion" value={`${num1}+${num2}`} />

        <SubmitButton />
      </form>
  );
}
