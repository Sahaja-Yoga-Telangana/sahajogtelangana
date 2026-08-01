'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiCamera, FiUpload, FiEdit3, FiTrash2, FiPlus, FiCheck, FiAlertCircle } from 'react-icons/fi';
import YogiDashboardShell from '@/components/YogiDashboardShell';
import CityPicker from '@/components/CityPicker';

type SeekerRow = {
  id: string;
  name: string;
  phone: string;
  city: string;
  email: string;
  preferredLanguage: string;
  notes: string;
};

const MOCK_OCR_RESULTS: SeekerRow[] = [
  { id: 'ocr-1', name: 'Niranjan Patnaik', phone: '9437102030', city: 'Bhubaneswar', email: 'niranjan@gmail.com', preferredLanguage: 'Odia', notes: 'OCR extracted from image' },
  { id: 'ocr-2', name: 'Ramesh Reddy', phone: '9908123456', city: 'Hyderabad', email: '', preferredLanguage: 'Telugu', notes: 'OCR extracted from image' },
  { id: 'ocr-3', name: 'Srinivas Murthy', phone: '9845011223', city: 'Secunderabad', email: 'srinivas.m@gmail.com', preferredLanguage: 'English', notes: 'OCR extracted from image' },
];

export default function ScanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [seekers, setSeekers] = useState<SeekerRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SeekerRow>({
    id: '', name: '', phone: '', city: '', email: '', preferredLanguage: 'English', notes: '',
  });

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 text-center text-sm text-[color:var(--muted)]">Loading...</div>
    );
  }

  const runRealOcr = async (imageUri: string) => {
    setImagePreview(imageUri);
    setIsScanning(true);
    setMessage('');

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUri }),
      });
      const resData = await response.json();
      if (response.ok && resData.status === 200) {
        setSeekers(resData.data);
        setMessageType('success');
        setMessage(`OCR completed. Extracted ${resData.data.length} seekers. Please review.`);
      } else {
        setMessageType('error');
        setMessage(resData.message || 'Failed to scan image.');
      }
    } catch (err: any) {
      setMessageType('error');
      setMessage(err.message || 'Error occurred while contacting OCR API.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const uri = ev.target?.result as string;
      runRealOcr(uri);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const uri = ev.target?.result as string;
      runRealOcr(uri);
    };
    reader.readAsDataURL(file);

    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    setSeekers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStartEdit = (s: SeekerRow) => {
    setEditId(s.id);
    setEditForm({ ...s });
  };

  const handleSaveEdit = () => {
    setSeekers((prev) => prev.map((s) => (s.id === editId ? { ...editForm } : s)));
    setEditId(null);
  };

  const handleAddRow = () => {
    const newEntry: SeekerRow = {
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
            source: 'Website Camera Scan',
          }))
        ),
      });

      const data = await res.json();

      if (res.status === 201) {
        setMessageType('success');
        setMessage(`${seekers.length} seeker(s) registered successfully!`);
        setSeekers([]);
        setImagePreview(null);
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
            <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/88 p-6 shadow-soft md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10">
                  <FiCamera className="text-[color:var(--primary)]" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[color:var(--ink)]">Scan Using Camera</h1>
                  <p className="text-sm text-[color:var(--muted)] mt-1">
                    Take a photo of a physical registration list to auto-extract seeker details.
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`mb-6 flex items-start gap-3 rounded-[20px] border px-4 py-3 text-sm ${
                    messageType === 'success'
                      ? 'border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]'
                      : 'border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 text-[color:var(--danger)]'
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

              {/* Capture Options */}
              {!imagePreview && !isScanning && seekers.length === 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[color:var(--border)] p-10 transition-colors hover:border-[color:var(--primary)]/40"
                  >
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                      <FiCamera className="text-[color:var(--primary)]" size={28} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[color:var(--ink)]">Open Camera</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">Capture a registration list page</p>
                    </div>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[color:var(--border)] p-10 transition-colors hover:border-[color:var(--primary)]/40"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary)]/10">
                      <FiUpload className="text-[color:var(--primary)]" size={28} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[color:var(--ink)]">Upload Image</p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">Choose a photo from your device</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-[color:var(--border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Captured page" className="w-full max-h-80 object-contain bg-black/5" />
                </div>
              )}

              {/* Scanning Indicator */}
              {isScanning && (
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)]/50 p-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--primary)] border-t-transparent" />
                  <div>
                    <p className="font-medium text-[color:var(--ink)]">Running AI OCR page scanner...</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">Extracting names and phone numbers</p>
                  </div>
                </div>
              )}

              {/* Retake Button */}
              {imagePreview && !isScanning && seekers.length === 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => { setImagePreview(null); setMessage(''); }}
                    className="rounded-full border border-[color:var(--border)] px-6 py-2.5 text-sm text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-2)]"
                  >
                    Retake Photo
                  </button>
                </div>
              )}

              {/* Seeker Preview */}
              {!isScanning && seekers.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                      Extracted Seekers ({seekers.length})
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
                              {seeker.notes && (
                                <p className="mt-1.5 text-xs italic text-[color:var(--muted)]">{seeker.notes}</p>
                              )}
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
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--danger)]/30 text-[color:var(--danger)] hover:bg-[color:var(--danger)]/10"
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
