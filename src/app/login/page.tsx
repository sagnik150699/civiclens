'use client';
import { useActionState, useEffect, useState, useRef } from 'react';
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

function SubmitButton({ isAuthenticating }: { isAuthenticating: boolean }) {
    const { pending } = useFormStatus();
    const isDisabled = pending || isAuthenticating;
    return (
      <Button type="submit" className="w-full" disabled={isDisabled}>
        {isAuthenticating ? "Authenticating..." : pending ? "Logging in..." : "Login"}
      </Button>
    );
  }

export default function LoginPage() {
    const [state, formAction] = useActionState(login, undefined);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [idToken, setIdToken] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            router.push('/admin');
        } else if (state?.message) {
            toast({
                title: 'Login Failed',
                description: state.message,
                variant: 'destructive',
            });
             // Reset state after showing error
            setIsAuthenticating(false);
        }
    }, [state, router, toast]);

    useEffect(() => {
        // When idToken is set, we can submit the formAction
        if (idToken && formRef.current) {
            // We use a hidden input and programmatically submit to ensure
            // the idToken is part of the form data for the server action.
            const formData = new FormData(formRef.current);
            formData.set('idToken', idToken);
            formAction(formData);
        }
    }, [idToken, formAction]);
    
    const handleLoginAttempt = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
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

        setIsAuthenticating(true);
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            setIdToken(token); // This will trigger the useEffect to call the action
        } catch (error) {
            const authError = error as AuthError;
            console.error("Firebase Authentication Error:", authError);
            toast({
                title: 'Login Failed',
                description: authError.message || 'An unknown authentication error occurred.',
                variant: 'destructive',
            });
            setIsAuthenticating(false);
        }
    };
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="w-full max-w-md">
            <form ref={formRef} action={formAction}>
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
                    {/* The button now triggers the client-side auth first */}
                    <Button onClick={handleLoginAttempt} className="w-full" disabled={isAuthenticating}>
                      {isAuthenticating ? "Logging in..." : "Login"}
                    </Button>
                </CardContent>
            </Card>
            </form>
        </div>
    </div>
  );
}
