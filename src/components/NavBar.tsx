'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NAV_LINKS } from '../../constants';
import { CustomUser } from '@/app/api/auth/[...nextauth]/options';
import { Locale, messages } from '@/lib/i18n';
import { useLocale, useTranslations } from '@/app/provider/localeProvider';
import { useTheme } from '@/app/provider/themeProvider';

type MessageKey = keyof typeof messages.en;

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileProfileOpen(false);
  }, [pathname]);

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
        scrolled ? 'nav-shadow backdrop-blur-xl' : 'backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <div className="flex items-center justify-between min-h-[72px] max-md:min-h-[64px] py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Sahaja Yoga Telangana — Home">
            <div className="relative h-9 w-40 transition-opacity group-hover:opacity-85">
              <Image
                src="/logo-brown.svg"
                alt="Sahaja Yoga Telangana"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : !!link.href && pathname.startsWith(link.href);

              if (link.children) {
                const hasActiveChild = link.children.some(
                  (child) => child.href && pathname.startsWith(child.href)
                );
                return (
                  <div key={link.key} className="relative group">
                    <button
                      className={`flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                        hasActiveChild
                          ? 'text-[color:var(--ink)]'
                          : 'text-[color:var(--muted)] hover:text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]'
                      }`}
                    >
                      {t(`nav.${link.key}` as MessageKey)}
                      <svg className="w-3.5 h-3.5 mt-px opacity-70 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute left-0 mt-2 w-60 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-pop p-1.5 opacity-0 invisible translate-y-1 scale-[0.97] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out origin-top-left">
                      {link.children.map((child) => {
                        const childActive = child.href && pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.key}
                            href={child.href}
                            className={`block rounded-xl px-3.5 py-2.5 text-[15px] transition-colors ${
                              childActive
                                ? 'bg-[color:var(--surface-2)] text-[color:var(--ink)] font-medium'
                                : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--ink)]'
                            }`}
                          >
                            {t(`nav.${child.key}` as MessageKey)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.key}
                  href={link.href!}
                  className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'text-[color:var(--ink)]'
                      : 'text-[color:var(--muted)] hover:text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]'
                  }`}
                >
                  {t(`nav.${link.key}` as MessageKey)}
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop right cluster */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1">
              <ThemeToggle />
              <LanguageToggle locale={locale} setLocale={setLocale} />
            </div>

            {/* Auth */}
            {session ? (
              <div ref={profileMenuRef} className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="flex items-center gap-2.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] py-1.5 pl-2 pr-3 shadow-card transition-colors hover:bg-[color:var(--surface-2)]"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-[color:var(--on-primary)]">
                      {profileInitial}
                    </span>
                  )}
                  <span className="hidden max-w-[130px] truncate text-sm font-medium text-[color:var(--ink)] xl:block">
                    {displayName}
                  </span>
                </button>

                {isProfileOpen ? (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-pop">
                    <div className="border-b border-[color:var(--border)] px-4 py-3">
                      <p className="truncate text-sm font-semibold text-[color:var(--ink)]">{displayName}</p>
                      <p className="truncate text-xs text-[color:var(--muted)]">{session.user?.email}</p>
                    </div>
                    <div className="p-1.5">
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
                        className="mt-0.5 block w-full rounded-xl px-3 py-2 text-left text-sm text-[color:var(--danger)] transition-colors hover:bg-[color:var(--surface-2)]"
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
                className="btn btn-primary btn-sm ml-1"
              >
                {t('nav.sign_in')}
              </button>
            )}
          </div>

          {/* Mobile right cluster */}
          <div className="flex items-center gap-2 lg:hidden">
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
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-[color:var(--on-primary)]">
                      {profileInitial}
                    </span>
                  )}
                </button>

                {isMobileProfileOpen ? (
                  <div className="absolute right-0 mt-3 w-[min(17rem,calc(100vw-1.25rem))] max-w-[calc(100vw-1.25rem)] overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-pop">
                    <div className="border-b border-[color:var(--border)] px-4 py-4">
                      <div className="flex items-center gap-3">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={displayName}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary)] text-sm font-semibold text-[color:var(--on-primary)]">
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
                        className="mt-1 block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-[color:var(--danger)] transition-colors hover:bg-[color:var(--surface-2)]"
                      >
                        {t('nav.sign_out')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] transition-colors hover:bg-[color:var(--surface-2)]"
              onClick={() => {
                setIsMobileProfileOpen(false);
                setIsMenuOpen((current) => !current);
              }}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div
          id="mobile-site-menu"
          className="lg:hidden border-t border-[color:var(--border)] bg-[color:var(--surface)] shadow-pop"
        >
          <div className="px-5 py-4 space-y-2 max-h-[calc(100vh-72px)] overflow-y-auto">
            {NAV_LINKS.map((link, linkIndex) => {
              if (link.children) {
                return (
                  <div key={link.key}>
                    <p className="px-2 pt-2 pb-1 text-[11px] font-semibold text-[color:var(--muted)] uppercase tracking-[0.2em]">
                      {t(`nav.${link.key}` as MessageKey)}
                    </p>
                    {link.children.map((child, childIndex) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-xl px-4 py-2.5 text-[15px] text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-2)] hover:text-[color:var(--ink)]"
                        style={{ animationDelay: `${linkIndex * 40 + childIndex * 30}ms` }}
                      >
                        {t(`nav.${child.key}` as MessageKey)}
                      </Link>
                    ))}
                  </div>
                );
              }

              const isActive =
                link.href === '/' ? pathname === '/' : !!link.href && pathname.startsWith(link.href);

              return (
                <Link
                  key={link.key}
                  href={link.href!}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-[15px] transition-colors ${
                    isActive
                      ? 'bg-[color:var(--surface-2)] font-medium text-[color:var(--ink)]'
                      : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--ink)]'
                  }`}
                  style={{ animationDelay: `${linkIndex * 40}ms` }}
                >
                  {t(`nav.${link.key}` as MessageKey)}
                </Link>
              );
            })}

            <div className="px-2 pt-3 space-y-3">
              <LanguageToggle locale={locale} setLocale={setLocale} mobile />
              <div className="flex items-center gap-3 pt-1">
                <ThemeToggle />
                <span className="text-sm text-[color:var(--muted)]">Toggle theme</span>
              </div>
            </div>

            {session ? null : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signIn();
                }}
                className="btn btn-primary w-full"
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

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-2)] hover:text-[color:var(--ink)]"
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
  );
}

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
    <div className={`inline-flex items-center gap-1 ${mobile ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
          locale === 'en'
            ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)]'
            : 'text-[color:var(--muted)] hover:text-[color:var(--ink)]'
        }`}
      >
        {t('locale.english')}
      </button>
      <button
        type="button"
        onClick={() => setLocale('te')}
        className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
          locale === 'te'
            ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)]'
            : 'text-[color:var(--muted)] hover:text-[color:var(--ink)]'
        }`}
      >
        {t('locale.telugu')}
      </button>
    </div>
  );
}

export default Navbar;
