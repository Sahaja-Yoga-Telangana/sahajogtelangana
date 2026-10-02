'use client';

import { useEffect, useMemo, useRef, useState, FormEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiSave, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Session = {
  _id: string;
  sno: number;
  speaker: string;
  speakerPhone: string;
  institution: string;
  branch: string;
  principal: string;
  phone: string;
  date: string;
  dateKey: string;
  time: string;
  remarks: string;
  students: number | null;
  direction: string;
  approvalBy: string;
  approvalContact: string;
  mapUrl: string;
  maxSpeakers: number;
};

type SortKey = 'sno' | 'institution' | 'date' | 'time' | 'principal' | 'maxSpeakers';

const emptyForm = {
  institution: '',
  branch: '',
  principal: '',
  phone: '',
  date: '',
  time: '',
  remarks: '',
  students: '',
  direction: '',
  approvalBy: '',
  approvalContact: '',
  mapUrl: '',
  maxSpeakers: '4',
  sno: '',
};

export default function TourManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/tour-sessions')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSessions(data.rows || []);
      })
      .catch(() => setError('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, [status]);

  const dates = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (s.dateKey) set.add(s.dateKey);
    });
    return Array.from(set).sort();
  }, [sessions]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      onClick={() => toggleSort(field)}
      className="inline-flex items-center gap-1 font-semibold text-[color:var(--ink)] hover:text-[color:var(--primary)]"
    >
      {label}
      {sortKey === field ? (
        sortDir === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />
      ) : (
        <span className="text-[color:var(--muted)] opacity-40">
          <FiChevronUp size={14} />
        </span>
      )}
    </button>
  );

  const filtered = useMemo(() => {
    let list = sessions.filter((s) => {
      if (dateFilter && s.dateKey !== dateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.institution.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q) ||
          s.principal.toLowerCase().includes(q)
        );
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'sno':
          cmp = (a.sno || 0) - (b.sno || 0);
          break;
        case 'institution':
          cmp = a.institution.localeCompare(b.institution);
          break;
        case 'date':
          cmp = (a.dateKey || 'zzz').localeCompare(b.dateKey || 'zzz');
          break;
        case 'time':
          cmp = (a.time || 'zzz').localeCompare(b.time || 'zzz');
          break;
        case 'principal':
          cmp = (a.principal || '').localeCompare(b.principal || '');
          break;
        case 'maxSpeakers':
          cmp = (a.maxSpeakers || 4) - (b.maxSpeakers || 4);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [sessions, search, dateFilter, sortKey, sortDir]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setFormOpen(true);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const openEdit = (s: Session) => {
    setEditingId(s._id);
    setForm({
      institution: s.institution,
      branch: s.branch,
      principal: s.principal,
      phone: s.phone,
      date: s.date,
      time: s.time,
      remarks: s.remarks,
      students: s.students != null ? String(s.students) : '',
      direction: s.direction,
      approvalBy: s.approvalBy,
      approvalContact: s.approvalContact,
      mapUrl: s.mapUrl,
      maxSpeakers: String(s.maxSpeakers || 4),
      sno: s.sno != null ? String(s.sno) : '',
    });
    setFormError('');
    setFormOpen(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const payload: Record<string, unknown> = {
      institution: form.institution,
      branch: form.branch,
      principal: form.principal,
      phone: form.phone,
      date: form.date,
      time: form.time,
      remarks: form.remarks,
      students: form.students ? Number(form.students) : null,
      direction: form.direction,
      approvalBy: form.approvalBy,
      approvalContact: form.approvalContact,
      mapUrl: form.mapUrl,
      maxSpeakers: Number(form.maxSpeakers) || 4,
      sno: form.sno ? Number(form.sno) : 0,
    };

    if (form.date) {
      const parts = form.date.split('/');
      if (parts.length === 3) {
        payload.dateKey = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    try {
      const res = await fetch('/api/tour-sessions', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? 'Session updated.' : 'Session created.');
        setFormOpen(false);
        setEditingId(null);
        fetch('/api/tour-sessions')
          .then((r) => r.json())
          .then((d) => setSessions(d.rows || []));
      } else {
        setFormError(data.error || 'Failed to save session');
        toast.error(data.error || 'Failed to save session');
      }
    } catch {
      setFormError('Failed to save session');
      toast.error('Failed to save session');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this session?')) return;
    try {
      const res = await fetch(`/api/tour-sessions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success('Session deleted.');
        setSessions((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete session');
      }
    } catch {
      toast.error('Failed to delete session');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <YogiDashboardShell
        memberName={session?.user?.name || undefined}
        activeKey="tour-sessions"
        userRole={session?.user?.role}
        introTitle="Tour Management"
        introBody="Create, edit, and manage Self Realization Tour sessions."
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
        </div>
      </YogiDashboardShell>
    );
  }

  return (
    <YogiDashboardShell
      memberName={session?.user?.name || undefined}
      activeKey="tour-sessions"
      userRole={session?.user?.role}
      introTitle="Tour Management"
      introBody="Create, edit, and manage Self Realization Tour sessions."
    >
      <div ref={topRef} className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Hyderabad 2026</p>
            <h1 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">
              Tour Sessions
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {sessions.length} total · {filtered.length} shown
            </p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <FiPlus size={16} /> Add Session
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institution, branch, principal…"
              className="admin-input admin-input-with-icon w-full"
            />
          </div>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="admin-input md:w-52">
            <option value="">All dates</option>
            {dates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Form */}
        <div ref={formRef}>
          {formOpen && (
            <form onSubmit={handleSubmit} className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[color:var(--ink)]">
                  {editingId ? 'Edit Session' : 'New Session'}
                </h2>
                <button type="button" onClick={() => setFormOpen(false)} className="btn btn-ghost btn-sm">
                  <FiX size={16} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Institution *</label>
                  <input
                    type="text"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    className="admin-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Branch / Address</label>
                  <input
                    type="text"
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Principal</label>
                  <input
                    type="text"
                    value={form.principal}
                    onChange={(e) => setForm({ ...form, principal: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="admin-input w-full"
                    inputMode="tel"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Date (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="28/09/2026"
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Time</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="10:00 AM"
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Students</label>
                  <input
                    type="number"
                    value={form.students}
                    onChange={(e) => setForm({ ...form, students: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Direction</label>
                  <input
                    type="text"
                    value={form.direction}
                    onChange={(e) => setForm({ ...form, direction: e.target.value })}
                    placeholder="West, North…"
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Max Speakers</label>
                  <input
                    type="number"
                    value={form.maxSpeakers}
                    onChange={(e) => setForm({ ...form, maxSpeakers: e.target.value })}
                    min={1}
                    max={20}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Approval By</label>
                  <input
                    type="text"
                    value={form.approvalBy}
                    onChange={(e) => setForm({ ...form, approvalBy: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Approval Contact</label>
                  <input
                    type="tel"
                    value={form.approvalContact}
                    onChange={(e) => setForm({ ...form, approvalContact: e.target.value })}
                    className="admin-input w-full"
                    inputMode="tel"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Google Map URL</label>
                  <input
                    type="url"
                    value={form.mapUrl}
                    onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Remarks</label>
                  <textarea
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    className="admin-input w-full"
                    rows={2}
                  />
                </div>
              </div>

              {formError && (
                <p className="mt-3 text-sm text-[color:var(--danger)]">{formError}</p>
              )}

              <div className="mt-4 flex gap-3">
                <button type="submit" disabled={formLoading} className="btn btn-primary">
                  <FiSave size={16} /> {formLoading ? 'Saving…' : editingId ? 'Update Session' : 'Create Session'}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {error && (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:color-mix(in_srgb,var(--danger)_8%,transparent)] p-4 text-sm text-[color:var(--danger)]">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
                  <th className="px-3 py-3"><SortHeader label="#" field="sno" /></th>
                  <th className="px-3 py-3"><SortHeader label="Institution" field="institution" /></th>
                  <th className="px-3 py-3">Branch</th>
                  <th className="px-3 py-3"><SortHeader label="Date" field="date" /></th>
                  <th className="px-3 py-3"><SortHeader label="Time" field="time" /></th>
                  <th className="px-3 py-3"><SortHeader label="Principal" field="principal" /></th>
                  <th className="px-3 py-3"><SortHeader label="Max" field="maxSpeakers" /></th>
                  <th className="sticky right-0 bg-[color:var(--surface-2)] px-3 py-3 text-right font-semibold text-[color:var(--ink)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b border-[color:var(--border)] transition-colors hover:bg-[color:var(--surface-2)]"
                  >
                    <td className="numeric-font px-3 py-2.5 text-[color:var(--muted)]">{s.sno || '—'}</td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-[color:var(--ink)]">{s.institution}</p>
                      {s.phone && <p className="numeric-font text-xs text-[color:var(--muted)]">{s.phone}</p>}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-[color:var(--muted)]">{s.branch}</td>
                    <td className="numeric-font px-3 py-2.5 text-[color:var(--muted)]">{s.date || '—'}</td>
                    <td className="numeric-font px-3 py-2.5 text-[color:var(--muted)]">{s.time || '—'}</td>
                    <td className="px-3 py-2.5 text-[color:var(--muted)]">{s.principal || '—'}</td>
                    <td className="numeric-font px-3 py-2.5 text-[color:var(--ink)]">{s.maxSpeakers || 4}</td>
                    <td className="sticky right-0 bg-[color:var(--surface)] px-3 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(s)}
                          className="btn btn-ghost btn-sm"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="btn btn-sm border border-[color:var(--danger)] text-[color:var(--danger)] hover:bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)]"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-sm text-[color:var(--muted)]">No sessions found.</p>
            </div>
          )}
        </div>
      </div>
    </YogiDashboardShell>
  );
}
