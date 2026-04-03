'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { NAV_LINKS } from '../../constants';
import { CustomUser } from '@/app/api/auth/[...nextauth]/options';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = (session?.user as CustomUser)?.role === 'Admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
                      {link.label}
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
                            {child.label}
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
                  {link.label}
                </Link>
              );
            })}

            {session ? (
              <Link
                href="/dashboard"
                className="px-3 py-2 text-[color:var(--muted)] hover:text-[color:var(--ink)] font-medium transition-colors"
              >
                Dashboard
              </Link>
            ) : null}

            {/* Admin */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="ml-2 px-4 py-2 bg-[color:var(--primary)] hover:bg-[color:var(--primary-600)] text-white rounded-full text-base font-medium transition"
              >
                Admin
              </Link>
            )}

            {/* Auth */}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="ml-2 px-4 py-2 border border-[color:var(--border)] rounded-full text-base hover:bg-[color:var(--surface-2)] transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="ml-2 px-4 py-2 border border-[color:var(--border)] rounded-full text-base hover:bg-[color:var(--surface-2)] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-[color:var(--surface-2)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[color:var(--surface)] border-t border-[color:var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="px-5 py-4 space-y-2 max-h-[calc(100vh-72px)] overflow-y-auto">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <div key={link.key}>
                    <p className="px-2 py-2 text-xs font-semibold text-[color:var(--muted)] uppercase tracking-widest">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 rounded-xl text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
                      >
                        {child.label}
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
                  {link.label}
                </Link>
              );
            })}

            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
              >
                Dashboard
              </Link>
            ) : null}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-white bg-[color:var(--primary)] rounded-full text-center"
              >
                Admin Dashboard
              </Link>
            )}

            {session ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-full text-sm hover:bg-[color:var(--surface-2)] transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signIn();
                }}
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-full text-sm hover:bg-[color:var(--surface-2)] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
