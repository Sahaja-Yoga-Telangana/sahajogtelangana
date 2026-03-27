'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdPeople,
  MdMessage,
  MdEvent,
  MdAddLocation,
  MdSupervisorAccount,
  MdCalendarToday,
  MdHowToReg,
  MdMenu,
  MdClose,
} from 'react-icons/md';

const menuItems = [
  { name: 'Dashboard', icon: <MdDashboard size={22} />, href: '/admin/dashboard' },
  { name: 'Messages', icon: <MdMessage size={22} />, href: '/admin/messages' },
  { name: 'Program Requests', icon: <MdEvent size={22} />, href: '/admin/program-requests' },
  { name: 'Seekers', icon: <MdPeople size={22} />, href: '/admin/seekers' },
  { name: 'Events', icon: <MdCalendarToday size={22} />, href: '/admin/events' },
  { name: 'Testimonials', icon: <MdMessage size={22} />, href: '/admin/testimonials' },
  { name: 'Event Registrations', icon: <MdHowToReg size={22} />, href: '/admin/event-registrations' },
  { name: 'Manage Centers', icon: <MdAddLocation size={22} />, href: '/admin/add-center' },
  { name: 'All Users', icon: <MdSupervisorAccount size={22} />, href: '/admin/all-users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="admin-shell flex min-h-screen">
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`admin-sidebar fixed md:sticky md:top-0 z-40 h-screen w-72 border-r border-white/10 text-white transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">Sahaja Yoga</p>
            <h1 className="mt-1 text-xl font-semibold">Admin Panel</h1>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(false)}
          >
            <MdClose size={26} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-4 space-y-1 px-3">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition
                  ${
                    active
                      ? 'bg-white/90 text-[color:var(--primary-600)] font-semibold shadow-soft'
                      : 'text-white/82 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.icon}
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="md:hidden border-b border-[color:var(--border)] bg-[color:var(--surface)]/90 px-4 py-3 backdrop-blur-sm flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="text-[color:var(--ink)]"
          >
            <MdMenu size={26} />
          </button>
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Admin Panel
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
