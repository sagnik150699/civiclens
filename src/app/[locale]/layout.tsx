
import { ReactNode } from 'react';
import {NextIntlClientProvider, useMessages} from 'next-intl';
import { Header } from '@/components/header';
import { cookies } from 'next/headers';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export default function LocaleLayout({children, params: {locale}}: Props) {
  const messages = useMessages();
  const cookieStore = cookies();
  const session = cookieStore.get('session');
  const isLoggedIn = !!session?.value;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
        <div lang={locale}>
            <Header isLoggedIn={isLoggedIn} />
            {children}
        </div>
    </NextIntlClientProvider>
  );
}
