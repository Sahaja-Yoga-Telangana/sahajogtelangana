'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  MdDashboard,
  MdEventNote,
  MdGroups,
  MdPersonAddAlt1,
  MdRateReview,
  MdVolunteerActivism,
} from 'react-icons/md';
import { useTranslations } from '@/app/provider/localeProvider';
import { hasFeatureAccess } from '@/lib/roles';

type NavItem = {
  key: string;
  name: string;
  href: string;
  description: string;
  icon: ReactNode;
  requiresFeatureAccess?: boolean;
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
    requiresFeatureAccess: true,
  },
  {
    key: 'seeker-followups',
    name: 'Seeker follow-up',
    href: '/dashboard/seeker-followups',
    description: 'Claim a small batch and update seeker follow-up notes.',
    icon: <MdGroups size={20} />,
    requiresFeatureAccess: true,
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
  userRole,
}: {
  children: ReactNode;
  memberName?: string;
  activeKey?: string;
  userRole?: string | null;
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
  const visibleNavItems = navItems.filter(
    (item) => !item.requiresFeatureAccess || hasFeatureAccess(userRole)
  );
  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-10">
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 space-y-4 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
            <SidebarIntro memberName={memberName} />
            <SidebarNav currentKey={currentKey} t={t} navItems={visibleNavItems} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 lg:hidden">
            <div className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]/94 shadow-[0_12px_28px_rgba(25,22,18,0.08)] backdrop-blur">
              <div className="px-2.5 py-2.5">
                <SidebarNav currentKey={currentKey} mobile t={t} navItems={visibleNavItems} />
              </div>
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

  if (pathname === '/dashboard/seeker-followups') {
    return 'seeker-followups';
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
  navItems,
}: {
  currentKey: string;
  mobile?: boolean;
  t: ReturnType<typeof useTranslations>;
  navItems: NavItem[];
}) {
  return (
    <nav className={mobile ? 'flex gap-2 overflow-x-auto pb-0.5' : 'space-y-2'}>
      {navItems.map((item) => {
        const active = item.key === currentKey;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`border transition-colors ${
              mobile
                ? `group min-w-fit shrink-0 rounded-[18px] px-2.5 py-2 ${
                    active
                      ? 'border-[color:var(--primary)] bg-[color:var(--primary)] text-white shadow-[0_10px_22px_rgba(108,90,74,0.2)]'
                      : 'border-[color:var(--border)] bg-[color:var(--surface)]/92 text-[color:var(--muted)]'
                  }`
                : `block rounded-[22px] px-4 py-4 ${
                    active
                      ? 'border-[color:var(--primary)] bg-[color:var(--surface-2)] text-[color:var(--ink)]'
                      : 'border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]'
                  }`
            }`}
          >
            {mobile ? (
              <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  active ? 'bg-white/18 text-white' : 'bg-[color:var(--surface-2)] text-[color:var(--primary)]'
                }`}>
                  {item.icon}
                </span>
                <span className={`max-w-[132px] text-xs font-semibold leading-5 ${
                  active ? 'text-white' : 'text-[color:var(--ink)]'
                }`}>
                  {getNavLabel(t, item.key)}
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[color:var(--primary)]">{item.icon}</span>
                <div>
                  <p className="font-semibold text-[color:var(--ink)]">{getNavLabel(t, item.key)}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{getNavDescription(t, item.key)}</p>
                </div>
              </div>
            )}
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
    case 'seeker-followups':
      return 'Seeker follow-up';
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
    case 'seeker-followups':
      return 'Claim a batch and record follow-up details.';
    case 'share-your-experience':
      return t('dashboard.share_experience_desc');
    case 'volunteer':
      return t('dashboard.volunteer_desc');
    default:
      return t('dashboard.dashboard_desc');
  }
}
