'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  MdDashboard,
  MdEventNote,
  MdPersonAddAlt1,
  MdRateReview,
  MdVolunteerActivism,
} from 'react-icons/md';
import { useTranslations } from '@/app/provider/localeProvider';

type NavItem = {
  key: string;
  name: string;
  href: string;
  description: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    description: 'Profile, events, centers, and collective history.',
    icon: <MdDashboard size={20} />,
  },
  {
    key: 'add-seeker',
    name: 'Add a seeker',
    href: '/add-seeker',
    description: 'Capture seeker follow-up details for the collective.',
    icon: <MdPersonAddAlt1 size={20} />,
  },
  {
    key: 'event-registrations',
    name: 'Event registrations',
    href: '/dashboard/event-registrations',
    description: 'Review your registrations, receipt numbers, and payment trail.',
    icon: <MdEventNote size={20} />,
  },
  {
    key: 'share-your-experience',
    name: 'Share your experience',
    href: '/share-your-experience',
    description: 'Offer a lived experience that may inspire others.',
    icon: <MdRateReview size={20} />,
  },
  {
    key: 'volunteer',
    name: 'Volunteer with us',
    href: '/volunteer',
    description: 'Offer seva and stay available for collective support.',
    icon: <MdVolunteerActivism size={20} />,
  },
];

export default function YogiDashboardShell({
  children,
  memberName,
  activeKey,
}: {
  children: ReactNode;
  memberName?: string;
  activeKey?: string;
}) {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const t = useTranslations();

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const currentKey = activeKey || getActiveKey(pathname, hash);

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-10">
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 space-y-4 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
            <SidebarIntro memberName={memberName} />
            <SidebarNav currentKey={currentKey} t={t} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-16 z-30 mb-6 lg:hidden">
            <div className="space-y-3 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)]/95 p-4 shadow-soft backdrop-blur">
              <SidebarIntro memberName={memberName} compact />
              <SidebarNav currentKey={currentKey} mobile t={t} />
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function getActiveKey(pathname: string, hash = '') {
  if (pathname === '/dashboard/event-registrations' || (pathname === '/dashboard' && hash === '#event-history')) {
    return 'event-registrations';
  }

  if (pathname === '/add-seeker') {
    return 'add-seeker';
  }

  if (pathname === '/share-your-experience') {
    return 'share-your-experience';
  }

  if (pathname === '/volunteer') {
    return 'volunteer';
  }

  return 'dashboard';
}

function SidebarIntro({ memberName, compact = false }: { memberName?: string; compact?: boolean }) {
  const t = useTranslations();

  return (
    <div className={`rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 ${compact ? 'p-4' : 'p-5'}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">{t('dashboard.shell_title')}</p>
      <h1 className={`mt-3 font-semibold text-[color:var(--ink)] ${compact ? 'text-xl' : 'text-2xl'}`}>
        {memberName || t('dashboard.shell_name')}
      </h1>
      <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
        {t('dashboard.shell_body')}
      </p>
    </div>
  );
}

function SidebarNav({
  currentKey,
  mobile = false,
  t,
}: {
  currentKey: string;
  mobile?: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <nav className={mobile ? 'flex gap-3 overflow-x-auto pb-1' : 'space-y-2'}>
      {navItems.map((item) => {
        const active = item.key === currentKey;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`border transition-colors ${
              mobile
                ? `min-w-[240px] rounded-[22px] px-4 py-4 ${
                    active
                      ? 'border-[color:var(--primary)] bg-[color:var(--surface-2)] text-[color:var(--ink)]'
                      : 'border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)]'
                  }`
                : `block rounded-[22px] px-4 py-4 ${
                    active
                      ? 'border-[color:var(--primary)] bg-[color:var(--surface-2)] text-[color:var(--ink)]'
                      : 'border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]'
                  }`
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[color:var(--primary)]">{item.icon}</span>
              <div>
                <p className="font-semibold text-[color:var(--ink)]">{getNavLabel(t, item.key)}</p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{getNavDescription(t, item.key)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

function getNavLabel(t: ReturnType<typeof useTranslations>, key: string) {
  switch (key) {
    case 'add-seeker':
      return t('dashboard.add_seeker');
    case 'event-registrations':
      return t('dashboard.event_registrations');
    case 'share-your-experience':
      return t('dashboard.share_experience');
    case 'volunteer':
      return t('dashboard.volunteer');
    default:
      return t('nav.dashboard');
  }
}

function getNavDescription(t: ReturnType<typeof useTranslations>, key: string) {
  switch (key) {
    case 'add-seeker':
      return t('dashboard.add_seeker_desc');
    case 'event-registrations':
      return t('dashboard.event_registrations_desc');
    case 'share-your-experience':
      return t('dashboard.share_experience_desc');
    case 'volunteer':
      return t('dashboard.volunteer_desc');
    default:
      return t('dashboard.dashboard_desc');
  }
}
