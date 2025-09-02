'use client';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/actions';
import { MountainIcon } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Logging in..." : "Login"}
      </Button>
    );
  }

export default function LoginPage() {
    const [state, formAction] = useActionState(login, undefined);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success) {
            router.push('/admin');
        } else if (state?.message) {
            toast({
                title: 'Login Failed',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, router, toast]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        if (!email || !password) {
            toast({
                title: 'Login Failed',
                description: 'Email and password are required.',
                variant: 'destructive',
            });
            return;
        }
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            
            const actionFormData = new FormData();
            actionFormData.append('idToken', idToken);
            
            // We directly call the server action here.
            // The useEffect hook will handle the redirect on success.
            formAction(actionFormData);

        } catch (error) {
            const authError = error as AuthError;
            console.error("Firebase Authentication Error:", authError);
            toast({
                title: 'Login Failed',
                description: authError.message || 'An unknown authentication error occurred.',
                variant: 'destructive',
            });
        }
    };
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center mb-4" prefetch={false}>
                        <MountainIcon className="h-8 w-8 text-primary" />
                    </Link>
                    <CardTitle className="text-2xl font-bold font-headline">Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <SubmitButton />
                </CardContent>
            </Card>
            </form>
        </div>
    </div>
  );
}
