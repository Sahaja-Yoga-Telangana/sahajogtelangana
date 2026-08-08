'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUsers, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';
import { SCREENING_QUESTIONS } from '@/data/volunteer-screening';

type Assessment = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  interests?: string[];
  availability?: string;
  experience?: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  wordCount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  reviewedAt?: string | null;
};

export default function VolunteerAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAssessments = useCallback(async () => {
    const response = await fetch('/api/auth/admin/volunteer-assessments');
    const data = await response.json();
    setAssessments(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const handleAction = async (assessmentId: string, action: 'approve' | 'reject') => {
    setBusyId(assessmentId);
    try {
      const response = await fetch('/api/auth/admin/volunteer-assessments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, action }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update screening');
      }
      toast.success(action === 'approve' ? 'Volunteer approved — email now has volunteer access' : 'Application rejected');
      fetchAssessments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update screening');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = statusFilter
    ? assessments.filter((assessment) => assessment.status === statusFilter)
    : assessments;

  const scoreTone = (score: number, maxScore: number) => {
    const ratio = maxScore > 0 ? score / maxScore : 0;
    if (ratio >= 0.8) return 'bg-[color:color-mix(in_srgb,var(--success)_15%,transparent)] text-[color:var(--success)]';
    if (ratio >= 0.5) return 'bg-[color:color-mix(in_srgb,var(--accent)_15%,transparent)] text-[color:var(--accent)]';
    return 'bg-[color:color-mix(in_srgb,var(--danger)_15%,transparent)] text-[color:var(--danger)]';
  };

  const statusTone = (status: string) => {
    if (status === 'Approved') return 'bg-[color:color-mix(in_srgb,var(--success)_15%,transparent)] text-[color:var(--success)]';
    if (status === 'Rejected') return 'bg-[color:color-mix(in_srgb,var(--danger)_15%,transparent)] text-[color:var(--danger)]';
    return 'bg-[color:color-mix(in_srgb,var(--accent)_15%,transparent)] text-[color:var(--accent)]';
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Volunteers</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Volunteer screening</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              Public applications with a suitability score based on their Sahaja-related answers. Review the answers, then
              approve the right applicants — approval grants the email volunteer access.
            </p>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input max-w-[220px]">
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="admin-card p-8 text-sm text-[color:var(--muted)]">Loading screenings...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiUsers className="w-7 h-7 text-[color:var(--muted)]" />}
          title="No screenings yet"
          message="Public volunteer screening applications will appear here with their scores."
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((assessment) => {
            const expanded = expandedId === assessment._id;
            return (
              <article key={assessment._id} className="admin-card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => setExpandedId(expanded ? null : assessment._id)}
                      className="mt-1 text-[color:var(--muted)] transition hover:text-[color:var(--primary)]"
                      aria-label={expanded ? 'Hide details' : 'Show details'}
                    >
                      {expanded ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-[color:var(--ink)]">{assessment.name}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusTone(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{assessment.email}</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {assessment.city || 'City not shared'} • {assessment.phone || 'Phone not shared'} •{' '}
                        {new Date(assessment.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreTone(assessment.score, assessment.maxScore)}`}>
                      Score {assessment.score}/{assessment.maxScore}
                    </span>
                    {assessment.status === 'Pending' ? (
                      <button
                        type="button"
                        onClick={() => handleAction(assessment._id, 'approve')}
                        disabled={busyId === assessment._id}
                        className="admin-btn-primary disabled:opacity-60"
                      >
                        Approve
                      </button>
                    ) : null}
                    {assessment.status === 'Pending' ? (
                      <button
                        type="button"
                        onClick={() => handleAction(assessment._id, 'reject')}
                        disabled={busyId === assessment._id}
                        className="admin-btn-secondary disabled:opacity-60"
                      >
                        Reject
                      </button>
                    ) : null}
                  </div>
                </div>

                {expanded ? (
                  <div className="border-t border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_40%,transparent)] p-5 md:p-6">
                    <div className="grid gap-4 text-sm md:grid-cols-3">
                      <p className="text-[color:var(--muted)]">
                        <span className="font-semibold text-[color:var(--ink)]">Interests:</span> {(assessment.interests || []).join(', ') || 'Not shared'}
                      </p>
                      <p className="text-[color:var(--muted)]">
                        <span className="font-semibold text-[color:var(--ink)]">Availability:</span> {assessment.availability || 'Not shared'}
                      </p>
                      <p className="text-[color:var(--muted)]">
                        <span className="font-semibold text-[color:var(--ink)]">Practice:</span> {assessment.experience || 'Not shared'}
                      </p>
                    </div>

                    <div className="mt-6 space-y-5">
                      {SCREENING_QUESTIONS.map((question) => {
                        const answer = assessment.answers?.[question.id] || '';
                        return (
                          <div key={question.id}>
                            <p className="text-sm font-medium text-[color:var(--ink)]">{question.prompt}</p>
                            <p className="mt-1.5 rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-6 text-[color:var(--ink)]">
                              {answer || <span className="text-[color:var(--muted)]">No answer</span>}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-6 text-xs text-[color:var(--muted)]">
                      Why-volunteer word count: {assessment.wordCount} • Score {assessment.score}/{assessment.maxScore}
                      {assessment.reviewedAt ? ` • Reviewed ${new Date(assessment.reviewedAt).toLocaleString('en-IN')}` : ''}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
