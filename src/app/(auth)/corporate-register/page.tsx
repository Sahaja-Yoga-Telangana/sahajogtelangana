'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';

export default function CorporateRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: { name: '', position: '', email: '', phone: '' },
    officeAddress: { street: '', city: '', state: '' },
    preferredProgramDate: new Date(),
    additionalRemarks: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCorporate = () => {
    const errors: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?[0-9]{6,15}$/;

    if (!formData.companyName || formData.companyName.trim().length < 2) errors['companyName'] = 'Company name is required';

    if (!formData.contactPerson.name || formData.contactPerson.name.trim().length < 2) errors['contactPerson.name'] = 'Contact name is required';
    if (!formData.contactPerson.position || formData.contactPerson.position.trim().length < 2) errors['contactPerson.position'] = 'Position is required';
    if (!emailRe.test(formData.contactPerson.email)) errors['contactPerson.email'] = 'Valid email is required';
    if (!phoneRe.test(formData.contactPerson.phone)) errors['contactPerson.phone'] = 'Valid phone is required';

    if (!formData.officeAddress.street || formData.officeAddress.street.trim().length < 5) errors['officeAddress.street'] = 'Street is required';
    if (!formData.officeAddress.city || formData.officeAddress.city.trim().length < 2) errors['officeAddress.city'] = 'City is required';
    if (!formData.officeAddress.state || formData.officeAddress.state.trim().length < 2) errors['officeAddress.state'] = 'State is required';

    return errors;
  };

  const handleSubmit = async () => {
    const nextErrors = validateCorporate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Block submit when invalid and show inline errors
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/corporate-register', {
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

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[color:var(--ink)] leading-tight">
            Meditation Programs for Corporates
          </h1>

          <p className="mt-6 text-lg text-[color:var(--muted)] max-w-xl">
            Individual employees with reduced stress levels, improved attention,
            and a sense of contentment contribute directly to organizational
            success. Sahaja Yoga Meditation supports healthier workplace
            dynamics and sustainable productivity.
          </p>

          <ul className="mt-8 space-y-3 text-[color:var(--muted)]">
            <li>• Free of cost and non-commercial</li>
            <li>• Neutral, inclusive, and practical</li>
            <li>• Suitable for all roles and seniority levels</li>
            <li>• On-site and online sessions available</li>
          </ul>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-soft">
          <Image
            src="/corporate.jpg"
            alt="Corporate meditation session"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ================= WHY CORPORATES ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[color:var(--surface)] backdrop-blur rounded-2xl shadow-sm p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
            Why Meditation Matters in the Workplace
          </h2>

          <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
            Modern workplaces often involve high expectations, tight deadlines,
            and constant change. Unexpected situations and unclear demands can
            increase stress, anxiety, and insecurity among employees.
            Sahaja Yoga Meditation helps individuals remain calm, balanced, and
            clear-headed—enabling better responses to workplace challenges.
          </p>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] text-center">
          Benefits of Sahaja Yoga Meditation for Your Organization
        </h2>

        <p className="mt-3 text-[color:var(--muted)] text-center max-w-3xl mx-auto">
          Meditation improves not just individual well-being, but also team
          dynamics, leadership effectiveness, and organizational culture.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            title="Stress Management"
            text="Meditation helps employees remain calm during high-pressure situations, reducing anxiety and enabling thoughtful, effective action."
          />
          <InfoCard
            title="Self-Confidence"
            text="Improved self-awareness through meditation builds confidence, strengthening interpersonal relationships with peers and management."
          />
          <InfoCard
            title="Leadership Qualities"
            text="Meditation nurtures leadership traits such as emotional intelligence, creativity, courage, self-awareness, and the ability to influence positively."
          />
          <InfoCard
            title="Patience & Clarity"
            text="Patience prevents reactive behaviour, allowing clarity, sound judgement, and effective decision-making in challenging situations."
          />
        </div>
      </section>

      {/* ================= CUSTOMIZED SESSIONS ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[color:var(--surface-2)]/70 backdrop-blur rounded-2xl p-8 md:p-10 border border-[#f2d8c5]">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
            Customized Meditation Sessions & Workshops
          </h2>

          <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
            Every organization is different. We work with you to understand your
            needs and customize meditation sessions or workshops that align with
            your workplace culture and objectives.
          </p>

          <ul className="mt-6 space-y-2 text-[color:var(--muted)]">
            <li>• All sessions and workshops are conducted free of cost</li>
            <li>• Duration and recurrence depend on your requirements</li>
            <li>• Suitable for pilot sessions, wellness days, or ongoing programs</li>
          </ul>

          <p className="mt-6 text-[color:var(--muted)]">
            If you wish to organize a meditation program or workshop in your
            organization, please get in touch using the form below.
          </p>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <div className="bg-[color:var(--surface)] rounded-2xl shadow-md p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
            Request a Corporate Meditation Session
          </h2>

          <p className="mt-2 text-[color:var(--muted)] max-w-2xl">
            Share your details below and our team will connect with you to
            understand your requirements. There is no obligation.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Company Name" error={errors['companyName']} onChange={(v) =>
              setFormData({ ...formData, companyName: v })
            } />

            <Input label="Contact Person Name" error={errors['contactPerson.name']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, name: v } })
            } />

            <Input label="Designation / Role" error={errors['contactPerson.position']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, position: v } })
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

            <Input label="Office Address" className="md:col-span-2" error={errors['officeAddress.street']} onChange={(v) =>
              setFormData({ ...formData, officeAddress: { ...formData.officeAddress, street: v } })
            } />

            <Input label="City" error={errors['officeAddress.city']} onChange={(v) =>
              setFormData({ ...formData, officeAddress: { ...formData.officeAddress, city: v } })
            } />

            <Input label="State" error={errors['officeAddress.state']} onChange={(v) =>
              setFormData({ ...formData, officeAddress: { ...formData.officeAddress, state: v } })
            } />

            <div className="md:col-span-2">
              <label className="block text-base font-medium text-[color:var(--muted)]">
                Additional Remarks (optional)
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full bg-[color:var(--surface-2)] rounded-md border border-gray-300 p-2"
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

/* ================= REUSABLE COMPONENTS ================= */

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
