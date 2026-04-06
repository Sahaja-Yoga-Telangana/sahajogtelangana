import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, Locale, LOCALE_COOKIE } from '@/lib/i18n';

export function getRequestLocale(): Locale {
  const cookieValue = cookies().get(LOCALE_COOKIE)?.value;
  return cookieValue && isLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;
}
