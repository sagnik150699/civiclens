'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/actions';
import { MountainIcon } from 'lucide-react';
import Link from 'next-intl/link';
import { useTranslations } from 'next-intl';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useTranslations('LoginPage');
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t('loggingInButton') : t('loginButton')}
      </Button>
    );
  }

export default function LoginPage() {
    const [state, formAction] = useActionState(login, undefined);
    const t = useTranslations('LoginPage');

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="w-full max-w-md">
            <form action={formAction}>
            <Card>
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center mb-4" prefetch={false}>
                        <MountainIcon className="h-8 w-8 text-primary" />
                    </Link>
                    <CardTitle className="text-2xl font-bold font-headline">{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">{t('usernameLabel')}</Label>
                        <Input id="username" name="username" placeholder={t('usernamePlaceholder')} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t('passwordLabel')}</Label>
                        <Input id="password" name="password" type="password" placeholder={t('passwordPlaceholder')} required />
                    </div>
                    {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
                    <SubmitButton />
                </CardContent>
            </Card>
            </form>
        </div>
    </div>
  );
}
