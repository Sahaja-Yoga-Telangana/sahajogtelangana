'use client';

import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../../constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from '@/app/provider/localeProvider';
import { useTheme } from '@/app/provider/themeProvider';
import { messages } from '@/lib/i18n';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

type MessageKey = keyof typeof messages.en;

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return <FaFacebookF className="h-4 w-4" />;
    case 'instagram':
      return <FaInstagram className="h-4 w-4" />;
    case 'youtube':
      return <FaYoutube className="h-4 w-4" />;
    default:
      return null;
  }
};

const Footer = () => {
  const t = useTranslations();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-[color:var(--surface)] pt-16 pb-8 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)] flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-44">
                <Image src="/logo-brown.svg" alt="Sahaja Yoga Telangana" fill className="object-contain" />
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] text-[color:var(--muted)] leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="mt-6">
              <p className="eyebrow mb-3">{t('footer.connect')}</p>
              <ul className="flex gap-2.5">
                {SOCIALS.links.map((link, index) => (
                  <a
                    href={link.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted)] transition-all duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] hover:-translate-y-0.5"
                    aria-label={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted)] transition-all duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] hover:-translate-y-0.5"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </ul>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((columns) => (
            <FooterColumn title={t(columns.titleKey as MessageKey)} key={columns.titleKey}>
              <ul className="flex flex-col gap-2.5">
                {columns.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.path}
                      className="text-[15px] text-[color:var(--muted)] transition-all duration-200 hover:text-[color:var(--ink)] hover:translate-x-0.5"
                    >
                      {t(link.labelKey as MessageKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          ))}

          {/* Contact */}
          <FooterColumn title={t(FOOTER_CONTACT_INFO.titleKey as MessageKey)}>
            <ul className="flex flex-col gap-4">
              {FOOTER_CONTACT_INFO.links.map((link) => (
                <li key={link.labelKey} className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    {t(link.labelKey as MessageKey)}
                  </span>
                  <span className="text-[15px] text-[color:var(--ink)]">{link.value}</span>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        <div className="border-t border-[color:var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[color:var(--muted)]">{t('footer.copyright')}</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--ink)]">
              Privacy Policy
            </Link>
            <Link href="/delete-account" className="text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--ink)]">
              Data Deletion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="eyebrow">{title}</p>
      {children}
    </div>
  )
}

export default Footer
