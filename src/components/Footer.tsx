'use client';

import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../../constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from '@/app/provider/localeProvider';
import { messages } from '@/lib/i18n';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

type MessageKey = keyof typeof messages.en;

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'facebook':
      return <FaFacebookF className="h-5 w-5" />;
    case 'instagram':
      return <FaInstagram className="h-5 w-5" />;
    case 'youtube':
      return <FaYoutube className="h-5 w-5" />;
    default:
      return null;
  }
};

const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="bg-[color:var(--surface)] pt-12 pb-6 border-t border-[color:var(--border)]">
      <div className="shrine-container flex w-full flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="mb-6 md:mb-0 md:w-1/3">
            <Link href="/" className="mb-6 inline-block">
              <div className="relative h-12 w-48">
                <Image src="/logo-brown.svg" alt="Sahaja Yoga Telangana" fill className="object-contain" />
              </div>
            </Link>
            <p className="mt-4 text-[color:var(--muted)] text-base leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="mt-6">
              <h4 className="text-[color:var(--ink)] font-semibold mb-3">{t('footer.connect')}</h4>
              <ul className="flex gap-3">
                {SOCIALS.links.map((link, index) => (
                  <a
                    href={link.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[color:var(--muted)] hover:text-[color:var(--primary)] border border-[color:var(--border)] hover:bg-[color:var(--surface-2)] p-2 rounded-full transition-colors flex items-center justify-center"
                    aria-label={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </ul>
            </div>
          </div>

          <div className='flex flex-wrap gap-10 md:flex-1 justify-between'>
            {FOOTER_LINKS.map((columns) => (
              <FooterColumn title={t(columns.titleKey as MessageKey)} key={columns.titleKey}>
                <ul className="flex flex-col gap-3 text-[color:var(--muted)]">
                  {columns.links.map((link) => (
                    <li key={link.labelKey}>
                      <Link 
                        href={link.path} 
                        className="text-base hover:text-[color:var(--ink)] hover:underline transition-colors"
                      >
                        {t(link.labelKey as MessageKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            <div className="flex flex-col gap-5">
              <FooterColumn title={t(FOOTER_CONTACT_INFO.titleKey as MessageKey)}>
                <ul className="flex flex-col gap-3">
                  {FOOTER_CONTACT_INFO.links.map((link) => (
                    <li key={link.labelKey} className="flex flex-col md:flex-row gap-1 text-base">
                      <span className="text-[color:var(--ink)] font-medium">
                        {t(link.labelKey as MessageKey)}:
                      </span>
                      <span className="text-[color:var(--muted)]">
                        {link.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--border)] my-2" />
        <p className="text-base text-center text-[color:var(--muted)]">{t('footer.copyright')}</p>
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
      <h4 className="text-[color:var(--ink)] font-semibold">{title}</h4>
      {children}
    </div>
  )
}

export default Footer
