'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { useLocale } from '@/app/provider/localeProvider';
import CityPicker from '@/components/CityPicker';

const content = {
  en: {
    heroTitle: 'Meditation Programs for Corporates',
    heroBody:
      'Individual employees with reduced stress levels, improved attention, and a sense of contentment contribute directly to organizational success. Sahaja Yoga Meditation supports healthier workplace dynamics and sustainable productivity.',
    heroPoints: [
      'Free of cost and non-commercial',
      'Neutral, inclusive, and practical',
      'Suitable for all roles and seniority levels',
      'On-site and online sessions available',
    ],
    whyTitle: 'Why Meditation Matters in the Workplace',
    whyBody:
      'Modern workplaces often involve high expectations, tight deadlines, and constant change. Unexpected situations and unclear demands can increase stress, anxiety, and insecurity among employees. Sahaja Yoga Meditation helps individuals remain calm, balanced, and clear-headed, enabling better responses to workplace challenges.',
    benefitsTitle: 'Benefits of Sahaja Yoga Meditation for Your Organization',
    benefitsBody:
      'Meditation improves not just individual well-being, but also team dynamics, leadership effectiveness, and organizational culture.',
    benefits: [
      ['Stress Management', 'Meditation helps employees remain calm during high-pressure situations, reducing anxiety and enabling thoughtful, effective action.'],
      ['Self-Confidence', 'Improved self-awareness through meditation builds confidence, strengthening interpersonal relationships with peers and management.'],
      ['Leadership Qualities', 'Meditation nurtures leadership traits such as emotional intelligence, creativity, courage, self-awareness, and the ability to influence positively.'],
      ['Patience & Clarity', 'Patience prevents reactive behaviour, allowing clarity, sound judgement, and effective decision-making in challenging situations.'],
    ],
    customTitle: 'Customized Meditation Sessions & Workshops',
    customBody:
      'Every organization is different. We work with you to understand your needs and customize meditation sessions or workshops that align with your workplace culture and objectives.',
    customPoints: [
      'All sessions and workshops are conducted free of cost',
      'Duration and recurrence depend on your requirements',
      'Suitable for pilot sessions, wellness days, or ongoing programs',
    ],
    customFooter:
      'If you wish to organize a meditation program or workshop in your organization, please get in touch using the form below.',
    formTitle: 'Request a Corporate Meditation Session',
    formBody:
      'Share your details below and our team will connect with you to understand your requirements. There is no obligation.',
    labels: {
      companyName: 'Company Name',
      contactName: 'Contact Person Name',
      position: 'Designation / Role',
      email: 'Email Address',
      phone: 'Phone Number',
      preferredDate: 'Preferred Program Date',
      address: 'Office Address',
      city: 'City',
      state: 'State',
      remarks: 'Additional Remarks (optional)',
    },
    submit: 'Submit Request',
    submitting: 'Submitting…',
    errors: {
      companyName: 'Company name is required',
      contactName: 'Contact name is required',
      position: 'Position is required',
      email: 'Valid email is required',
      phone: 'Valid phone is required',
      street: 'Street is required',
      city: 'City is required',
      state: 'State is required',
    },
  },
  te: {
    heroTitle: 'కార్పొరేట్ల కోసం ధ్యాన కార్యక్రమాలు',
    heroBody:
      'ఒత్తిడి తగ్గి, ఏకాగ్రత పెరిగి, అంతర సంతృప్తి పెరిగిన ఉద్యోగులు సంస్థ విజయానికి నేరుగా తోడ్పడతారు. సహజ యోగ ధ్యానం కార్యాలయంలో ఆరోగ్యకరమైన సంబంధాలు మరియు స్థిరమైన ఉత్పాదకతకు మద్దతు ఇస్తుంది.',
    heroPoints: [
      'పూర్తిగా ఉచితం మరియు వాణిజ్యరహితం',
      'తటస్థం, అందరికీ అనుకూలం, ఆచరణాత్మకం',
      'అన్ని హోదాలు మరియు స్థాయిల వారికి అనువైనది',
      'ఆన్‌సైట్ మరియు ఆన్‌లైన్ సెషన్లు అందుబాటులో ఉన్నాయి',
    ],
    whyTitle: 'కార్యాలయంలో ధ్యానం ఎందుకు ముఖ్యము',
    whyBody:
      'ఆధునిక కార్యాలయాల్లో అధిక అంచనాలు, కఠిన గడువులు, నిరంతర మార్పులు సాధారణం. ఆకస్మిక పరిస్థితులు ఉద్యోగుల్లో ఒత్తిడి, ఆందోళన, అస్థిరతను పెంచవచ్చు. సహజ యోగ ధ్యానం వారిని ప్రశాంతంగా, సమతుల్యంగా, స్పష్టతతో ఉంచి మంచి ప్రతిస్పందనకు సహాయపడుతుంది.',
    benefitsTitle: 'మీ సంస్థకు సహజ యోగ ధ్యాన ప్రయోజనాలు',
    benefitsBody:
      'ధ్యానం వ్యక్తిగత శ్రేయస్సుతో పాటు టీమ్ సమన్వయం, నాయకత్వ ప్రభావం, సంస్థ సంస్కృతినీ మెరుగుపరుస్తుంది.',
    benefits: [
      ['ఒత్తిడి నిర్వహణ', 'అధిక ఒత్తిడి పరిస్థితుల్లో కూడా ప్రశాంతంగా ఉండటానికి సహాయపడుతుంది, తద్వారా ఆలోచించి సరైన చర్య తీసుకోగలరు.'],
      ['ఆత్మవిశ్వాసం', 'ధ్యానం ద్వారా వచ్చే స్వీయ అవగాహన ఆత్మవిశ్వాసాన్ని పెంచి సహచరులు, యాజమాన్యంతో సంబంధాలను బలోపేతం చేస్తుంది.'],
      ['నాయకత్వ లక్షణాలు', 'భావోద్వేగ మేధస్సు, సృజనాత్మకత, ధైర్యం, స్వీయ అవగాహన వంటి నాయకత్వ లక్షణాలను పెంపొందిస్తుంది.'],
      ['సహనం & స్పష్టత', 'సహనం వల్ల ఆవేశపూరిత ప్రతిస్పందన తగ్గి స్పష్టమైన నిర్ణయాలు తీసుకోవడం సులభమవుతుంది.'],
    ],
    customTitle: 'అనుకూలీకరించిన ధ్యాన సెషన్లు & వర్క్‌షాప్‌లు',
    customBody:
      'ప్రతి సంస్థ ప్రత్యేకమైనది. మీ అవసరాలు, కార్యాలయ సంస్కృతి, లక్ష్యాలకు సరిపోయేలా మేము ధ్యాన సెషన్లు లేదా వర్క్‌షాప్‌లను అనుకూలీకరిస్తాము.',
    customPoints: [
      'అన్ని సెషన్లు, వర్క్‌షాప్‌లు ఉచితంగా నిర్వహించబడతాయి',
      'వ్యవధి మరియు పునరావృతం మీ అవసరాలపై ఆధారపడి ఉంటుంది',
      'పైలట్ సెషన్లు, వెల్‌నెస్ డేస్, లేదా నిరంతర కార్యక్రమాలకు అనువైనది',
    ],
    customFooter:
      'మీ సంస్థలో ధ్యాన కార్యక్రమం లేదా వర్క్‌షాప్ నిర్వహించాలనుకుంటే, దిగువ ఫారమ్ ద్వారా మమ్మల్ని సంప్రదించండి.',
    formTitle: 'కార్పొరేట్ ధ్యాన సెషన్ కోసం అభ్యర్థించండి',
    formBody:
      'మీ వివరాలను క్రింద పంచుకోండి. మా బృందం మీ అవసరాలు తెలుసుకోవడానికి మిమ్మల్ని సంప్రదిస్తుంది. ఎటువంటి బలవంతం లేదు.',
    labels: {
      companyName: 'సంస్థ పేరు',
      contactName: 'సంప్రదింపు వ్యక్తి పేరు',
      position: 'హోదా / పాత్ర',
      email: 'ఇమెయిల్ చిరునామా',
      phone: 'ఫోన్ నంబర్',
      preferredDate: 'అభిలషిత కార్యక్రమ తేదీ',
      address: 'కార్యాలయ చిరునామా',
      city: 'నగరం',
      state: 'రాష్ట్రం',
      remarks: 'అదనపు వ్యాఖ్యలు (ఐచ్చికం)',
    },
    submit: 'అభ్యర్థనను పంపండి',
    submitting: 'పంపిస్తోంది…',
    errors: {
      companyName: 'సంస్థ పేరు అవసరం',
      contactName: 'సంప్రదింపు పేరు అవసరం',
      position: 'హోదా అవసరం',
      email: 'సరైన ఇమెయిల్ అవసరం',
      phone: 'సరైన ఫోన్ నంబర్ అవసరం',
      street: 'వీధి చిరునామా అవసరం',
      city: 'నగరం అవసరం',
      state: 'రాష్ట్రం అవసరం',
    },
  },
} as const;

export default function CorporateRegisterPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = content[locale];
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

    if (!formData.companyName || formData.companyName.trim().length < 2) errors['companyName'] = copy.errors.companyName;

    if (!formData.contactPerson.name || formData.contactPerson.name.trim().length < 2) errors['contactPerson.name'] = copy.errors.contactName;
    if (!formData.contactPerson.position || formData.contactPerson.position.trim().length < 2) errors['contactPerson.position'] = copy.errors.position;
    if (!emailRe.test(formData.contactPerson.email)) errors['contactPerson.email'] = copy.errors.email;
    if (!phoneRe.test(formData.contactPerson.phone)) errors['contactPerson.phone'] = copy.errors.phone;

    if (!formData.officeAddress.street || formData.officeAddress.street.trim().length < 5) errors['officeAddress.street'] = copy.errors.street;
    if (!formData.officeAddress.city || formData.officeAddress.city.trim().length < 2) errors['officeAddress.city'] = copy.errors.city;
    if (!formData.officeAddress.state || formData.officeAddress.state.trim().length < 2) errors['officeAddress.state'] = copy.errors.state;

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
            {copy.heroTitle}
          </h1>

          <p className="mt-6 text-lg text-[color:var(--muted)] max-w-xl">
            {copy.heroBody}
          </p>

          <ul className="mt-8 space-y-3 text-[color:var(--muted)]">
            {copy.heroPoints.map((item) => (
              <li key={item}>• {item}</li>
            ))}
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
            {copy.whyTitle}
          </h2>

          <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
            {copy.whyBody}
          </p>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] text-center">
          {copy.benefitsTitle}
        </h2>

        <p className="mt-3 text-[color:var(--muted)] text-center max-w-3xl mx-auto">
          {copy.benefitsBody}
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.benefits.map(([title, text]) => (
            <InfoCard key={title} title={title} text={text} />
          ))}
        </div>
      </section>

      {/* ================= CUSTOMIZED SESSIONS ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[color:var(--surface-2)]/70 backdrop-blur rounded-2xl p-8 md:p-10 border border-[#f2d8c5]">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
            {copy.customTitle}
          </h2>

          <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
            {copy.customBody}
          </p>

          <ul className="mt-6 space-y-2 text-[color:var(--muted)]">
            {copy.customPoints.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>

          <p className="mt-6 text-[color:var(--muted)]">
            {copy.customFooter}
          </p>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <div className="bg-[color:var(--surface)] rounded-2xl shadow-md p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
            {copy.formTitle}
          </h2>

          <p className="mt-2 text-[color:var(--muted)] max-w-2xl">
            {copy.formBody}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label={copy.labels.companyName} error={errors['companyName']} onChange={(v) =>
              setFormData({ ...formData, companyName: v })
            } />

            <Input label={copy.labels.contactName} error={errors['contactPerson.name']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, name: v } })
            } />

            <Input label={copy.labels.position} error={errors['contactPerson.position']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, position: v } })
            } />

            <Input label={copy.labels.email} type="email" error={errors['contactPerson.email']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, email: v } })
            } />

            <Input label={copy.labels.phone} error={errors['contactPerson.phone']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, phone: v } })
            } />

            <div>
              <label className="block text-base font-medium text-[color:var(--muted)]">
                {copy.labels.preferredDate}
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

            <Input label={copy.labels.address} className="md:col-span-2" error={errors['officeAddress.street']} onChange={(v) =>
              setFormData({ ...formData, officeAddress: { ...formData.officeAddress, street: v } })
            } />

            <div>
              <label className="block text-base font-medium text-[color:var(--muted)]">{copy.labels.city}</label>
              <CityPicker
                value={formData.officeAddress.city}
                onChange={(v) => setFormData({ ...formData, officeAddress: { ...formData.officeAddress, city: v } })}
                className={`mt-1 bg-[color:var(--surface-2)] w-full rounded-md border p-2 ${errors['officeAddress.city'] ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors['officeAddress.city'] && <p className="mt-1 text-base text-red-600">{errors['officeAddress.city']}</p>}
            </div>

            <Input label={copy.labels.state} error={errors['officeAddress.state']} onChange={(v) =>
              setFormData({ ...formData, officeAddress: { ...formData.officeAddress, state: v } })
            } />

            <div className="md:col-span-2">
              <label className="block text-base font-medium text-[color:var(--muted)]">
                {copy.labels.remarks}
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
            {loading ? copy.submitting : copy.submit}
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
