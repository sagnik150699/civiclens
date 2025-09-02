import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function LocaleLayout({children}: Props) {
  return children;
}
