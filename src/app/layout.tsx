
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'CivicLens',
  description: 'Report civic issues and improve your community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');
  let isLoggedIn = false;
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      isLoggedIn = session.loggedIn === true;
    } catch (e) {
      isLoggedIn = false;
    }
  }


  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
          <Header isLoggedIn={isLoggedIn}/>
          {children}
          <Toaster />
      </body>
    </html>
  );
}
