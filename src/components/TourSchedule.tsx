'use client';

import { useEffect, useMemo, useState, FormEvent } from 'react';
import { FiSearch, FiMapPin, FiCheckCircle, FiCircle, FiUserPlus, FiX } from 'react-icons/fi';

type Row = {
  _id: string;
  sno: number | null;
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

type Assignment = {
  _id: string;
  sessionKey: string;
  speakerName: string;
  speakerPhone: string;
};

const DATE_LABELS: Record<string, string> = {
  '2026-08-21': 'Fri, 21 Aug',
  '2026-08-22': 'Sat, 22 Aug',
  '2026-08-26': 'Wed, 26 Aug',
  '2026-08-28': 'Fri, 28 Aug',
  '2026-08-29': 'Sat, 29 Aug',
  '2026-08-30': 'Sun, 30 Aug',
  '2026-09-01': 'Tue, 1 Sep',
  '2026-09-03': 'Thu, 3 Sep',
};

const DEFAULT_MAX_SPEAKERS = 4;

function sessionKeyFor(row: Row) {
  return `${row.sno ?? 0}-${row.dateKey}-${row.institution}`;
}

export default function TourSchedule() {
  const [rows, setRows] = useState<Row[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [assigningKey, setAssigningKey] = useState<string | null>(null);
  const [assignForm, setAssignForm] = useState({ name: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [openFormKey, setOpenFormKey] = useState<string | null>(null);
  const [myPhone, setMyPhone] = useState('');

  useEffect(() => {
    setMyPhone(localStorage.getItem('tour_speaker_phone') || '');
  }, []);

  const loadAssignments = () => {
    fetch('/api/tour-assignments')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setAssignments(data.assignments || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    Promise.all([fetch('/api/tour-schedule').then((r) => r.json()), fetch('/api/tour-assignments').then((r) => r.json())])
      .then(([s, a]) => {
        if (s.error) setError(s.error);
        else setRows(s.rows || []);
        if (!a.error) setAssignments(a.assignments || []);
      })
      .catch(() => setError('Failed to load schedule'))
      .finally(() => setLoading(false));
  }, []);

  const assignmentsBySession = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    assignments.forEach((a) => {
      if (!map.has(a.sessionKey)) map.set(a.sessionKey, []);
      map.get(a.sessionKey)!.push(a);
    });
    return map;
  }, [assignments]);

  const dates = useMemo(() => {
    const set = new Map<string, number>();
    rows.forEach((r) => {
      if (r.dateKey) set.set(r.dateKey, (set.get(r.dateKey) || 0) + 1);
    });
    return Array.from(set.entries()).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const key = sessionKeyFor(r);
      const sessionAssignments = assignmentsBySession.get(key) || [];
      const totalAssigned = (r.speaker ? 1 : 0) + sessionAssignments.length;

      if (statusFilter === 'assigned' && totalAssigned === 0) return false;
      if (statusFilter === 'unassigned' && totalAssigned > 0) return false;
      if (dateFilter && r.dateKey !== dateFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.institution.toLowerCase().includes(q) ||
          r.branch.toLowerCase().includes(q) ||
          r.principal.toLowerCase().includes(q) ||
          r.speaker.toLowerCase().includes(q) ||
          r.approvalBy.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rows, search, dateFilter, statusFilter, assignmentsBySession]);

  const stats = useMemo(() => {
    let assignedSessions = 0;
    let unassignedSessions = 0;
    rows.forEach((r) => {
      const key = sessionKeyFor(r);
      const selfAssigned = assignmentsBySession.get(key)?.length || 0;
      const total = (r.speaker ? 1 : 0) + selfAssigned;
      if (total > 0) assignedSessions++;
      else unassignedSessions++;
    });
    return { total: rows.length, assigned: assignedSessions, unassigned: unassignedSessions };
  }, [rows, assignmentsBySession]);

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const res = await fetch('/api/tour-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionKey: assigningKey,
          speakerName: assignForm.name,
          speakerPhone: assignForm.phone,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        localStorage.setItem('tour_speaker_phone', assignForm.phone.replace(/\s+/g, ''));
        setMyPhone(assignForm.phone.replace(/\s+/g, ''));
        setAssigningKey(null);
        setAssignForm({ name: '', phone: '' });
        setOpenFormKey(null);
        loadAssignments();
      } else {
        setFormError(data.error || 'Failed to assign');
      }
    } catch {
      setFormError('Failed to assign. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRelease = async (id: string, phone?: string) => {
    if (!confirm('Release your assignment for this session?')) return;
    try {
      const params = new URLSearchParams({ id });
      if (phone) params.set('phone', phone);
      await fetch(`/api/tour-assignments?${params}`, { method: 'DELETE' });
      loadAssignments();
    } catch {}
  };

  if (loading) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 text-center shadow-card">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
        <p className="mt-4 text-sm text-[color:var(--muted)]">Loading schedule…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-card">
        <p className="text-sm text-[color:var(--danger)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
          <p className="text-2xl font-semibold text-[color:var(--ink)]">{stats.total}</p>
          <p className="text-xs text-[color:var(--muted)]">Total Sessions</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
          <p className="text-2xl font-semibold text-[color:var(--success)]">{stats.assigned}</p>
          <p className="text-xs text-[color:var(--muted)]">Sessions with Speakers</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
          <p className="text-2xl font-semibold text-[color:var(--danger)]">{stats.unassigned}</p>
          <p className="text-xs text-[color:var(--muted)]">Need Speakers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institution, branch, speaker…"
              className="admin-input admin-input-with-icon w-full"
            />
          </div>
          <div className="flex gap-2">
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="admin-input">
              <option value="">All dates</option>
              {dates.map(([key, count]) => (
                <option key={key} value={key}>{DATE_LABELS[key] || key} ({count})</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="admin-input"
            >
              <option value="all">All</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-3">
        {filtered.map((row, i) => {
          const key = sessionKeyFor(row);
          const sessionAssignments = assignmentsBySession.get(key) || [];
          const totalAssigned = (row.speaker ? 1 : 0) + sessionAssignments.length;
          const isOpen = openFormKey === key;

          return (
            <div
              key={row._id}
              className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="numeric-font text-xs text-[color:var(--muted)]">#{row.sno ?? i + 1}</span>
                    <h3 className="text-base font-semibold text-[color:var(--ink)]">{row.institution}</h3>
                    <span className="text-sm text-[color:var(--muted)]">· {row.branch}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
                    <span className="numeric-font">{row.date}{row.time ? ` · ${row.time}` : ''}</span>
                    <span>Principal: {row.principal}</span>
                    {row.phone && <span className="numeric-font">{row.phone}</span>}
                    {row.students != null && <span>{row.students} students</span>}
                    <span className="numeric-font">{row.direction}</span>
                  </div>

                  {/* Speakers */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[color:var(--ink)]">
                      Speakers ({totalAssigned}/{row.maxSpeakers || DEFAULT_MAX_SPEAKERS}):
                    </span>
                    {row.speaker && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--success)_12%,transparent)] px-2.5 py-1 text-xs font-medium text-[color:var(--success)]">
                        <FiCheckCircle size={11} /> {row.speaker} (organizer)
                      </span>
                    )}
                    {sessionAssignments.map((a) => (
                      <span
                        key={a._id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] px-2.5 py-1 text-xs font-medium text-[color:var(--accent)]"
                      >
                        <FiCheckCircle size={11} /> {a.speakerName}
                        <button
                          onClick={() => handleRelease(a._id, a.speakerPhone)}
                          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[color:color-mix(in_srgb,var(--danger)_15%,transparent)] hover:text-[color:var(--danger)]"
                          title="Release"
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    ))}
                    {!row.speaker && sessionAssignments.length === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)] px-2.5 py-1 text-xs font-medium text-[color:var(--danger)]">
                        <FiCircle size={11} /> Need speakers
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {row.mapUrl && (
                    <a
                      href={row.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                    >
                      <FiMapPin size={14} /> Map
                    </a>
                  )}
                  {(() => {
                    const myAssignment = sessionAssignments.find(
                      (a) => myPhone && a.speakerPhone === myPhone
                    );
                    if (myAssignment) {
                      return (
                        <button
                          onClick={() => handleRelease(myAssignment._id, myPhone)}
                          className="btn btn-sm border border-[color:var(--danger)] bg-[color:color-mix(in_srgb,var(--danger)_8%,transparent)] text-[color:var(--danger)] hover:bg-[color:color-mix(in_srgb,var(--danger)_15%,transparent)]"
                        >
                          <FiX size={14} /> Release Me
                        </button>
                      );
                    }
                    if (totalAssigned < (row.maxSpeakers || DEFAULT_MAX_SPEAKERS)) {
                      return (
                        <button
                          onClick={() => {
                            setOpenFormKey(isOpen ? null : key);
                            setAssigningKey(key);
                            setFormError('');
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <FiUserPlus size={14} /> Assign Me
                        </button>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Inline assign form */}
              {isOpen && (
                <form onSubmit={handleAssign} className="mt-4 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                  <p className="mb-3 text-sm font-semibold text-[color:var(--ink)]">
                    Volunteer for {row.institution}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={assignForm.name}
                      onChange={(e) => setAssignForm({ ...assignForm, name: e.target.value })}
                      placeholder="Your name"
                      className="admin-input flex-1"
                      required
                      minLength={2}
                    />
                    <input
                      type="tel"
                      value={assignForm.phone}
                      onChange={(e) => setAssignForm({ ...assignForm, phone: e.target.value })}
                      placeholder="Phone number"
                      className="admin-input flex-1"
                      required
                      inputMode="tel"
                    />
                    <div className="flex gap-2">
                      <button type="submit" disabled={formLoading} className="btn btn-primary btn-sm">
                        {formLoading ? 'Assigning…' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenFormKey(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  {formError && (
                    <p className="mt-2 text-xs text-[color:var(--danger)]">{formError}</p>
                  )}
                </form>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 text-center shadow-card">
            <p className="text-sm text-[color:var(--muted)]">No entries match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
