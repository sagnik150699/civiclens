
'use client';
import { useState } from 'react';
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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsAuthenticating(true);

        if (!email || !password) {
            toast({
                title: 'Login Failed',
                description: 'Email and password are required.',
                variant: 'destructive',
            });
            setIsAuthenticating(false);
            return;
        }

        try {
            // 1. Sign in on the client with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // 2. Call the server action to create the session cookie
            const result = await login(token);

            if (result.success) {
                // 3. Redirect on success
                router.push('/admin');
            } else {
                toast({
                    title: 'Login Failed',
                    description: result.message || 'An unknown error occurred.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            const authError = error as AuthError;
            console.error("Authentication Error:", authError);
            toast({
                title: 'Login Failed',
                description: authError.message || 'An unknown authentication error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsAuthenticating(false);
        }
    };
    
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
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="admin@example.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleLogin} className="w-full" disabled={isAuthenticating}>
                      {isAuthenticating ? "Logging in..." : "Login"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
