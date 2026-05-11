'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NAV_LINKS } from '../../constants';
import { CustomUser } from '@/app/api/auth/[...nextauth]/options';
import { Locale, messages } from '@/lib/i18n';
import { useLocale, useTranslations } from '@/app/provider/localeProvider';

type MessageKey = keyof typeof messages.en;

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileProfileRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = (session?.user as CustomUser)?.role === 'Admin';
  const displayName = session?.user?.name?.trim() || 'Profile';
  const profileImage = session?.user?.image?.trim() || '';
  const profileInitial = displayName.charAt(0).toUpperCase() || 'P';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }

      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target as Node)) {
        setIsMobileProfileOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all nav-surface ${
        scrolled ? 'nav-shadow backdrop-blur-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between min-h-[72px] py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-40">
              <Image
                src="/logo-brown.svg"
                alt="Sahaja Yoga Telangana"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 text-base">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <div key={link.key} className="relative group">
                    <button className="px-3 py-2 text-[color:var(--muted)] hover:text-[color:var(--ink)] font-medium flex items-center gap-1 transition-colors">
                      {t(`nav.${link.key}` as MessageKey)}
                      <svg className="w-4 h-4 mt-[1px] text-[color:var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute left-0 mt-2 w-64 bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.key}
                            href={child.href}
                            className="block px-4 py-2.5 text-base text-[color:var(--muted)] hover:text-[color:var(--ink)] hover:bg-[color:var(--surface-2)] transition-colors"
                          >
                            {t(`nav.${child.key}` as MessageKey)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.key}
                  href={link.href!}
                  className="px-3 py-2 text-[color:var(--muted)] hover:text-[color:var(--ink)] font-medium transition-colors"
                >
                  {t(`nav.${link.key}` as MessageKey)}
                </Link>
              );
            })}

            <LanguageToggle locale={locale} setLocale={setLocale} />

            {/* Auth */}
            {session ? (
              <div ref={profileMenuRef} className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1.5 transition-colors hover:bg-[color:var(--surface-2)]"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                >
                  <span className="hidden max-w-[140px] truncate text-sm font-medium text-[color:var(--ink)] lg:block">
                    {displayName}
                  </span>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-white">
                      {profileInitial}
                    </span>
                  )}
                </button>

                {isProfileOpen ? (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-[color:var(--border)] px-4 py-3">
                      <p className="truncate text-sm font-semibold text-[color:var(--ink)]">{displayName}</p>
                      <p className="truncate text-xs text-[color:var(--muted)]">{session.user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                      >
                        {t('nav.dashboard')}
                      </Link>
                      {isAdmin ? (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                        >
                          {t('nav.admin_dashboard')}
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                      >
                        {t('nav.sign_out')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="ml-2 px-4 py-2 border border-[color:var(--border)] rounded-full text-base hover:bg-[color:var(--surface-2)] transition-colors"
              >
                {t('nav.sign_in')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {session ? (
              <div ref={mobileProfileRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsMobileProfileOpen((current) => !current);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] transition-colors hover:bg-[color:var(--surface-2)]"
                  aria-expanded={isMobileProfileOpen}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-white">
                      {profileInitial}
                    </span>
                  )}
                </button>

                {isMobileProfileOpen ? (
                  <div className="absolute right-0 mt-3 w-[min(17rem,calc(100vw-1.25rem))] max-w-[calc(100vw-1.25rem)] overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-[color:var(--border)] px-4 py-4">
                      <div className="flex items-center gap-3">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={displayName}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-white">
                            {profileInitial}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[color:var(--ink)]">{displayName}</p>
                          <p className="truncate text-xs text-[color:var(--muted)]">{session.user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileProfileOpen(false)}
                        className="block rounded-xl px-3 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                      >
                        {t('nav.dashboard')}
                      </Link>
                      {isAdmin ? (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsMobileProfileOpen(false)}
                          className="block rounded-xl px-3 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                        >
                          {t('nav.admin_dashboard')}
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileProfileOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="mt-1 block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                      >
                        {t('nav.sign_out')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              className="p-2 rounded-full hover:bg-[color:var(--surface-2)]"
              onClick={() => {
                setIsMobileProfileOpen(false);
                setIsMenuOpen((current) => !current);
              }}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-site-menu" className="md:hidden bg-[color:var(--surface)] border-t border-[color:var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="px-5 py-4 space-y-2 max-h-[calc(100vh-72px)] overflow-y-auto">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <div key={link.key}>
                    <p className="px-2 py-2 text-xs font-semibold text-[color:var(--muted)] uppercase tracking-widest">
                      {t(`nav.${link.key}` as MessageKey)}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 rounded-xl text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
                      >
                        {t(`nav.${child.key}` as MessageKey)}
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <Link
                  key={link.key}
                  href={link.href!}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
                >
                  {t(`nav.${link.key}` as MessageKey)}
                </Link>
              );
            })}

            <div className="px-2 pt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">
                {t('nav.language')}
              </p>
              <LanguageToggle locale={locale} setLocale={setLocale} mobile />
            </div>

            {session ? null : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signIn();
                }}
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-full text-sm hover:bg-[color:var(--surface-2)] transition-colors"
              >
                {t('nav.sign_in')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

function LanguageToggle({
  locale,
  setLocale,
  mobile = false,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  mobile?: boolean;
}) {
  const t = useTranslations();

  return (
    <div className={`inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1 ${mobile ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${locale === 'en' ? 'bg-[color:var(--primary)] text-white' : 'text-[color:var(--muted)]'}`}
      >
        {t('locale.english')}
      </button>
      <button
        type="button"
        onClick={() => setLocale('te')}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${locale === 'te' ? 'bg-[color:var(--primary)] text-white' : 'text-[color:var(--muted)]'}`}
      >
        {t('locale.telugu')}
      </button>
    </div>
  );
}

export default Navbar;
