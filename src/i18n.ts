import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'hi'];
export const localePrefix = 'always'; // Default

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
      // Handle invalid locale, maybe redirect or show a 404 page
  }
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});