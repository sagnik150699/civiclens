
'use client';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/actions';
import { MountainIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export default function LoginPage() {
    const { toast } = useToast();
    const [state, formAction] = useFormState(login, undefined);

    useEffect(() => {
        if (state?.success === false && state.message) {
            toast({
                title: 'Login Failed',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="w-full max-w-md">
            <Card>
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center mb-4" prefetch={false}>
                        <MountainIcon className="h-8 w-8 text-primary" />
                    </Link>
                    <CardTitle className="text-2xl font-bold font-headline">Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Username</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="text" 
                                placeholder="admin" 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>                            
                            <Input 
                                id="password" 
                                name="password" 
                                type="password" 
                                placeholder="admin"
                                required 
                            />
                        </div>
                        <LoginButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
