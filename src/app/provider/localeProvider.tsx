'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_LOCALE, getMessage, LOCALE_COOKIE, Locale, messages } from '@/lib/i18n';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof messages.en) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export default function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState((currentLocale) => {
        if (currentLocale === nextLocale) {
          return currentLocale;
        }

        return nextLocale;
      });
    },
    []
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_COOKIE, locale);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    if (locale !== initialLocale) {
      router.refresh();
    }
  }, [initialLocale, locale, router]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: keyof typeof messages.en) => getMessage(locale, key),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }

  return context;
}

export function useTranslations() {
  return useLocale().t;
}
