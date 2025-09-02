'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-muted-foreground" />
      <Select onValueChange={onSelectChange} defaultValue={locale}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t('label')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('en')}</SelectItem>
          <SelectItem value="hi">{t('hi')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
