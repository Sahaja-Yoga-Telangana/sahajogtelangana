'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';

export default function SchoolRegisterClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: { name: '', role: '', email: '', phone: '' },
    schoolAddress: { street: '', city: '', state: '' },
    preferredProgramDate: new Date(),
    additionalRemarks: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSchool = () => {
    const errors: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?[0-9]{6,15}$/;

    if (!formData.schoolName || formData.schoolName.trim().length < 2) errors['schoolName'] = 'School name is required';

    if (!formData.contactPerson.name || formData.contactPerson.name.trim().length < 2) errors['contactPerson.name'] = 'Contact name is required';
    if (!formData.contactPerson.role || formData.contactPerson.role.trim().length < 2) errors['contactPerson.role'] = 'Role is required';
    if (!emailRe.test(formData.contactPerson.email)) errors['contactPerson.email'] = 'Valid email is required';
    if (!phoneRe.test(formData.contactPerson.phone)) errors['contactPerson.phone'] = 'Valid phone is required';

    if (!formData.schoolAddress.street || formData.schoolAddress.street.trim().length < 5) errors['schoolAddress.street'] = 'Street is required';
    if (!formData.schoolAddress.city || formData.schoolAddress.city.trim().length < 2) errors['schoolAddress.city'] = 'City is required';
    if (!formData.schoolAddress.state || formData.schoolAddress.state.trim().length < 2) errors['schoolAddress.state'] = 'State is required';

    return errors;
  };

  const handleSubmit = async () => {
    const nextErrors = validateSchool();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Block submit when invalid and show inline errors
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/school-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.status === 400 && data?.errors) {
        setErrors(data.errors);
        setLoading(false);
        return;
      }
      router.push('/');
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[color:var(--ink)] leading-tight">
            Meditation Programs for Schools
          </h1>

          <p className="mt-6 text-lg text-[color:var(--muted)] max-w-xl">
            A simple, structured meditation program that supports students’
            concentration, emotional balance, and personality development —
            delivered in a safe, neutral, and age-appropriate manner.
          </p>

          <ul className="mt-8 space-y-3 text-[color:var(--muted)]">
            <li>• Free of cost and non-commercial</li>
            <li>• Neutral, inclusive, and suitable for all students</li>
            <li>• Focus on attention, calmness, and positive values</li>
            <li>• Conducted during school hours or special sessions</li>
          </ul>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-soft">
          <Image
            src="/school.jpeg"
            alt="Students meditation session"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </section>

      {/* CONTEXT */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[color:var(--surface)] backdrop-blur rounded-2xl shadow-sm p-8 md:p-10">
          <h2 className="text-2xl text-center font-semibold text-[color:var(--ink)]">
            Why Meditation Is Important for Children Today
          </h2>

          <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
            Children today are exposed to many modern-day influences that can
            adversely impact their attention span, behaviour, and communication
            skills. Sahaja Yoga Meditation helps to gently reverse these effects
            and brings out innate qualities such as compassion, respectfulness,
            emotional balance, and the ability to focus.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] text-center">
          Benefits of Sahaja Yoga Meditation for Children
        </h2>

        <p className="mt-3 text-[color:var(--muted)] text-center max-w-3xl mx-auto">
          Sahaja Yoga Meditation supports children’s inner growth in a natural,
          effortless, and joyful way.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            title="Social Skills"
            text="Children learn respectful communication with adults and peers, gaining confidence in both group and individual interactions."
          />
          <InfoCard
            title="Self-Confidence"
            text="Meditation reduces fear, anxiety, and insecurity, allowing natural talents and confidence to emerge."
          />
          <InfoCard
            title="Creativity"
            text="A calm and balanced mind allows children’s natural creativity and curiosity to flourish."
          />
          <InfoCard
            title="Memory & Attention"
            text="Meditation calms the mind, helping improve attention span, memory, and cognitive clarity."
          />
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <div className="bg-[color:var(--surface)] rounded-2xl shadow-md p-8 md:p-12">
          <h2 className="text-2xl text-center font-semibold text-[color:var(--ink)]">
            Request a School Program
          </h2>

          <p className="mt-2 text-[color:var(--muted)] max-w-2xl">
            Share your details below and our team will connect with you to
            coordinate a suitable program for your students.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="School Name" error={errors['schoolName']} onChange={(v) => setFormData({ ...formData, schoolName: v })} />
            <Input label="Contact Person Name" error={errors['contactPerson.name']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, name: v } })
            } />
            <Input label="Role" error={errors['contactPerson.role']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, role: v } })
            } />
            <Input label="Email Address" type="email" error={errors['contactPerson.email']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, email: v } })
            } />
            <Input label="Phone Number" error={errors['contactPerson.phone']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, phone: v } })
            } />

            <div>
              <label className="block text-base font-medium text-[color:var(--muted)]">
                Preferred Program Date
              </label>
              <DatePicker
                selected={formData.preferredProgramDate}
                onChange={(date) =>
                  setFormData({ ...formData, preferredProgramDate: date || new Date() })
                }
                className="mt-1 bg-[color:var(--surface-2)] w-full rounded-md border border-gray-300 p-2"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            
            <Input label="School Address" className="md:col-span-2" error={errors['schoolAddress.street']} onChange={(v) =>
              setFormData({ ...formData, schoolAddress: { ...formData.schoolAddress, street: v } })
            } />

            <Input label="City" error={errors['schoolAddress.city']} onChange={(v) =>
              setFormData({ ...formData, schoolAddress: { ...formData.schoolAddress, city: v } })
            } />

            <Input label="State" error={errors['schoolAddress.state']} onChange={(v) =>
              setFormData({ ...formData, schoolAddress: { ...formData.schoolAddress, state: v } })
            } />

            <div className="md:col-span-2">
              <label className="block text-base font-medium text-[color:var(--muted)]">
                Additional Remarks (optional)
              </label>
              <textarea
                rows={4}
                className="mt-1 bg-[color:var(--surface-2)] w-full rounded-md border border-gray-300 p-2"
                onChange={(e) =>
                  setFormData({ ...formData, additionalRemarks: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-10 w-full bg-[#5B2C41] hover:bg-[#4a2335] text-white py-3 rounded-md font-medium transition"
          >
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function Input({
  label,
  type = 'text',
  onChange,
  className = '',
  error,
}: {
  label: string;
  type?: string;
  onChange: (v: string) => void;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-base font-medium text-[color:var(--muted)]">{label}</label>
      <input
        type={type}
        className={`mt-1 bg-[color:var(--surface-2)] w-full rounded-md border p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-base text-red-600">{error}</p>}
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-[color:var(--surface)] rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[color:var(--ink)]">{title}</h3>
      <p className="mt-3 text-[color:var(--muted)] text-base leading-relaxed">{text}</p>
    </div>
  );
}
