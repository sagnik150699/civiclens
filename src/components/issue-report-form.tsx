'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { CameraIcon, Send } from 'lucide-react';
import { ISSUE_CATEGORIES } from '@/lib/constants';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  category: z.enum(ISSUE_CATEGORIES.map(c => c.value) as [string, ...string[]]),
  photo: z.any().optional(),
});

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
  const [state, formAction] = useFormState(submitIssue, { errors: {} });
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      category: undefined,
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default',
      });
      form.reset();
      setPreview(null);
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
      <form action={formAction} className="space-y-4">
        <h2 className="text-2xl font-bold font-headline text-center">Report an Issue</h2>
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue category" />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about the issue..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="pl-10"
                    {...photoRef}
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
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

        <SubmitButton />
      </form>
    </Form>
  );
}
