'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { submitIssue } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { CameraIcon, Send, LocateIcon } from 'lucide-react';
import { ISSUE_CATEGORIES } from '@/lib/constants';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]], {
    required_error: "Please select a category.",
  }),
  photo: z.any().refine(file => file instanceof File && file.size > 0, 'A photo is required.'),
  address: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  captcha: z.string().min(1, { message: 'Please solve the captcha.' }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations('IssueReportForm');
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t('submittingButton') : t('submitButton')}
      <Send className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function IssueReportForm() {
  const t = useTranslations('IssueReportForm');
  const { toast } = useToast();
  const [state, formAction] = useActionState(submitIssue, undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      category: undefined,
      address: '',
      captcha: '',
      photo: undefined,
    },
  });

  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          form.setValue('lat', lat.toString());
          form.setValue('lng', lng.toString());

          // Reverse geocode to get address
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
              form.setValue('address', data.display_name);
            } else {
              form.setValue('address', `Near lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}`);
            }
          } catch (error) {
            console.error("Reverse geocoding failed", error);
            form.setValue('address', `Near lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}`);
          }
          
          toast({
            title: t('geolocationSuccess'),
            description: t('geolocationSuccessDesc'),
          });
        },
        () => {
          toast({
            title: t('geolocationError'),
            description: t('geolocationErrorDesc'),
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: t('geolocationNotSupported'),
        description: t('geolocationNotSupportedDesc'),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
      });
      form.reset();
      setPreview(null);
      // Generate new numbers for next submission
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
    } else if (state?.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, form]);

  const photoRef = form.register('photo');

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => formRef.current?.requestSubmit())}
        className="space-y-4"
        // Use a key to force re-render on success and reset captcha
        key={num1 + num2}
      >
        <h2 className="text-2xl font-bold font-headline text-center">{t('title')}</h2>
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('categoryLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('categoryPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ISSUE_CATEGORIES.map(({ value, icon: Icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{t(value as any)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('descriptionLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('descriptionPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addressLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={t('addressPlaceholder')}
                    {...field}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" {...form.register("lat")} />
        <input type="hidden" {...form.register("lng")} />


        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('photoLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="pl-10"
                    {...photoRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {preview && (
          <div className="relative h-48 w-full">
            <Image
              src={preview}
              alt="Image preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              data-ai-hint="user uploaded image"
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="captcha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('captchaLabel', {num1, num2})}
              </FormLabel>
              <FormControl>
                <Input placeholder={t('captchaPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" name="captchaQuestion" value={`${num1}+${num2}`} />


        <SubmitButton />
      </form>
    </Form>
  );
}
