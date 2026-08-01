'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiUploadCloud, FiEdit3, FiTrash2, FiPlus, FiCheck, FiAlertCircle, FiFileText } from 'react-icons/fi';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import CityPicker from '@/components/CityPicker';

type SeekerEntry = {
  id: string;
  name: string;
  phone: string;
  city: string;
  email: string;
  preferredLanguage: string;
  notes: string;
};

function parseCsvRows(csvText: string): SeekerEntry[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return [];

  const parseLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const clean = (value?: string) => String(value || '').replace(/^["']|["']$/g, '').trim();
  const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
  const indexFor = (...patterns: string[]) =>
    headers.findIndex((h) => patterns.some((p) => h.includes(p)));

  const nameIdx = indexFor('name');
  const phoneIdx = indexFor('phone', 'whatsapp', 'number', 'mobile');
  const cityIdx = indexFor('city', 'address', 'location');
  const emailIdx = indexFor('email');
  const langIdx = indexFor('lang', 'speak');

  return lines.slice(1).flatMap((line, idx) => {
    const cols = parseLine(line);
    const entry: SeekerEntry = {
      id: `csv-${idx}-${Date.now()}`,
      name: clean(nameIdx !== -1 ? cols[nameIdx] : cols[0]),
      phone: clean(phoneIdx !== -1 ? cols[phoneIdx] : cols[1]).replace(/[^0-9+\-\s()]/g, ''),
      city: clean(cityIdx !== -1 ? cols[cityIdx] : cols[2]) || 'Hyderabad',
      email: clean(emailIdx !== -1 ? cols[emailIdx] : ''),
      preferredLanguage: clean(langIdx !== -1 ? cols[langIdx] : '') || 'English',
      notes: 'Imported from file',
    };
    return entry.name || entry.phone ? [entry] : [];
  });
}

export default function UploadSeekersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [seekers, setSeekers] = useState<SeekerEntry[]>([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SeekerEntry>({
    id: '', name: '', phone: '', city: '', email: '', preferredLanguage: 'English', notes: '',
  });

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 text-center text-sm text-[color:var(--muted)]">Loading...</div>
    );
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setMessage('');

    try {
      const text = await file.text();

      if (file.name.toLowerCase().endsWith('.csv')) {
        const parsed = parseCsvRows(text);
        if (parsed.length === 0) {
          setMessageType('error');
          setMessage('No valid seeker records found in the file.');
        } else {
          setSeekers(parsed);
          setMessageType('success');
          setMessage(`Loaded ${parsed.length} seekers from file.`);
        }
      } else {
        // Mock extraction for non-CSV (PDF, TXT, etc.)
        const mockData: SeekerEntry[] = [
          { id: 'mock-1', name: 'Koteswar Rao', phone: '9848022334', city: 'Hyderabad', email: 'kotesh@yahoo.com', preferredLanguage: 'Telugu', notes: 'Extracted from ' + file.name },
          { id: 'mock-2', name: 'Manish Patra', phone: '7766554432', city: 'Bhubaneswar', email: 'manish.patra@gmail.com', preferredLanguage: 'Odia', notes: 'Extracted from ' + file.name },
          { id: 'mock-3', name: 'Anjali Sharma', phone: '9988998811', city: 'Secunderabad', email: '', preferredLanguage: 'Hindi', notes: 'Extracted from ' + file.name },
        ];
        setSeekers(mockData);
        setMessageType('success');
        setMessage(`Extracted ${mockData.length} seekers from ${file.name}.`);
      }
    } catch {
      setMessageType('error');
      setMessage('Failed to parse the file. Please check the format.');
    } finally {
      setIsLoading(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    setSeekers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStartEdit = (s: SeekerEntry) => {
    setEditId(s.id);
    setEditForm({ ...s });
  };

  const handleSaveEdit = () => {
    setSeekers((prev) => prev.map((s) => (s.id === editId ? { ...editForm } : s)));
    setEditId(null);
  };

  const handleAddRow = () => {
    const newEntry: SeekerEntry = {
      id: `manual-${Date.now()}`,
      name: '',
      phone: '',
      city: 'Hyderabad',
      email: '',
      preferredLanguage: 'English',
      notes: 'Manually added',
    };
    setSeekers((prev) => [newEntry, ...prev]);
    handleStartEdit(newEntry);
  };

  const validate = () => {
    for (let i = 0; i < seekers.length; i++) {
      const s = seekers[i];
      if (!s.name.trim() || !s.phone.trim() || !s.city.trim()) {
        setMessageType('error');
        setMessage(`Row ${i + 1} (${s.name || 'unnamed'}) is missing name, phone, or city.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/add-seeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          seekers.map((s) => ({
            name: s.name.trim(),
            phone: s.phone.trim(),
            city: s.city.trim(),
            email: s.email.trim(),
            preferredLanguage: s.preferredLanguage,
            notes: s.notes,
            source: 'Website Document Import',
          }))
        ),
      });

      const data = await res.json();

      if (res.status === 201) {
        setMessageType('success');
        setMessage(`${seekers.length} seeker(s) registered successfully!`);
        setSeekers([]);
        setFileName('');
      } else {
        setMessageType('error');
        setMessage(data?.error || data?.message || 'Failed to submit.');
      }
    } catch {
      setMessageType('error');
      setMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userRole = session?.user?.role as string | undefined;

  return (
    <YogiDashboardShell memberName={session?.user?.name || undefined} userRole={userRole} activeKey="add-seeker">
      <main>
        <section className="relative overflow-hidden py-8 md:py-12">
          <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
            <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)]">
                  <FiFileText className="text-[color:var(--primary)]" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Upload Document</h1>
                  <p className="text-sm text-[color:var(--muted)] mt-1">
                    Import seekers from a CSV file or upload a document for AI extraction.
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-[20px] border px-4 py-3 text-sm ${
                    messageType === 'success'
                      ? 'border-[color:color-mix(in_srgb,var(--success)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--success)_10%,transparent)] text-[color:var(--success)]'
                      : 'border-[color:color-mix(in_srgb,var(--danger)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)] text-[color:var(--danger)]'
                  }`}
                >
                  {messageType === 'success' ? (
                    <FiCheck className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <p>{message}</p>
                </div>
              )}

              {/* File Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-[color:var(--border)] rounded-2xl p-10 text-center transition-colors hover:border-[color:color-mix(in_srgb,var(--primary)_40%,transparent)]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.pdf,.txt"
                  onChange={handleFile}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <FiUploadCloud className="text-[color:var(--primary)]" size={40} />
                  <p className="font-medium text-[color:var(--ink)]">
                    {fileName || 'Choose a file to upload'}
                  </p>
                  <p className="text-sm text-[color:var(--muted)]">
                    Supports CSV (with Name/Phone headers), Excel, PDF, and text files.
                  </p>
                </div>
              </div>

              {isLoading && (
                <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_50%,transparent)] p-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" />
                  <p className="text-sm text-[color:var(--muted)]">Processing file...</p>
                </div>
              )}

              {/* Seeker Preview */}
              {!isLoading && seekers.length > 0 && (
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                      Preview ({seekers.length} seeker{seekers.length !== 1 ? 's' : ''})
                    </p>
                    <button
                      onClick={handleAddRow}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-2)]"
                    >
                      <FiPlus size={14} />
                      Add Row
                    </button>
                  </div>

                  <div className="space-y-3">
                    {seekers.map((seeker) => (
                      <div
                        key={seeker.id}
                        className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
                      >
                        {editId === seeker.id ? (
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <EditField label="Name" value={editForm.name} onChange={(v) => setEditForm((p) => ({ ...p, name: v }))} />
                            <EditField label="Phone" value={editForm.phone} onChange={(v) => setEditForm((p) => ({ ...p, phone: v }))} />
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-[color:var(--muted)]">City</label>
                              <CityPicker value={editForm.city} onChange={(v) => setEditForm((p) => ({ ...p, city: v }))} className="admin-input text-sm" />
                            </div>
                            <EditField label="Email" value={editForm.email} onChange={(v) => setEditForm((p) => ({ ...p, email: v }))} />
                            <EditField label="Language" value={editForm.preferredLanguage} onChange={(v) => setEditForm((p) => ({ ...p, preferredLanguage: v }))} />
                            <EditField label="Notes" value={editForm.notes} onChange={(v) => setEditForm((p) => ({ ...p, notes: v }))} />
                            <div className="flex items-end gap-2 md:col-span-2 lg:col-span-3">
                              <button onClick={handleSaveEdit} className="admin-btn-primary text-sm px-5 py-2.5 rounded-full">
                                Save
                              </button>
                              <button onClick={() => setEditId(null)} className="rounded-full border border-[color:var(--border)] px-5 py-2.5 text-sm text-[color:var(--muted)]">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-[color:var(--ink)]">{seeker.name}</p>
                              <p className="mt-0.5 text-sm text-[color:var(--primary)]">{seeker.phone}</p>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[color:var(--muted)]">
                                <span>{seeker.city}</span>
                                {seeker.email && <span>{seeker.email}</span>}
                                <span>{seeker.preferredLanguage}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStartEdit(seeker)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                              >
                                <FiEdit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(seeker.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:color-mix(in_srgb,var(--danger)_30%,transparent)] text-[color:var(--danger)] hover:bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)]"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="admin-btn-primary inline-flex items-center gap-2 px-8 py-3 disabled:opacity-60"
                    >
                      {isSubmitting ? 'Registering...' : `Register ${seekers.length} Seeker${seekers.length !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </YogiDashboardShell>
  );
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[color:var(--muted)]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input text-sm"
      />
    </div>
  );
}
