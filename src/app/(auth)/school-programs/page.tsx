'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import { FiUsers, FiFeather, FiStar, FiBookOpen } from 'react-icons/fi';
import { useLocale } from '@/app/provider/localeProvider';
import CityPicker from '@/components/CityPicker';
import LoadingSpinner from '@/components/LoadingSpinner';
import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/motion/CountUp';

const content = {
  en: {
    heroTitle: 'Meditation Programs for Schools',
    heroBody:
      'A simple, structured meditation program that supports students’ concentration, emotional balance, and personality development, delivered in a safe, neutral, and age-appropriate manner.',
    heroPoints: [
      'Free of cost and non-commercial',
      'Neutral, inclusive, and suitable for all students',
      'Focus on attention, calmness, and positive values',
      'Conducted during school hours or special sessions',
    ],
    stats: [
      ['100+', 'Schools reached'],
      ['10K+', 'Children guided'],
      ['25+', 'Countries practicing'],
      ['100%', 'Free of cost'],
    ],
    quote:
      'Every child is born with inner peace — meditation simply helps them rediscover it, one calm breath at a time.',
    whyTitle: 'Why Meditation Is Important for Children Today',
    whyBody:
      'Children today are exposed to many modern-day influences that can adversely impact their attention span, behaviour, and communication skills. Sahaja Yoga Meditation helps to gently reverse these effects and brings out innate qualities such as compassion, respectfulness, emotional balance, and the ability to focus.',
    benefitsTitle: 'Benefits of Sahaja Yoga Meditation for Children',
    benefitsBody:
      'Sahaja Yoga Meditation supports children’s inner growth in a natural, effortless, and joyful way.',
    benefits: [
      ['Social Skills', 'Children learn respectful communication with adults and peers, gaining confidence in both group and individual interactions.'],
      ['Self-Confidence', 'Meditation reduces fear, anxiety, and insecurity, allowing natural talents and confidence to emerge.'],
      ['Creativity', 'A calm and balanced mind allows children’s natural creativity and curiosity to flourish.'],
      ['Memory & Attention', 'Meditation calms the mind, helping improve attention span, memory, and cognitive clarity.'],
    ],
    formTitle: 'Request a School Program',
    formBody:
      'Share your details below and our team will connect with you to coordinate a suitable program for your students.',
    formSections: {
      school: 'School',
      contact: 'Contact Person',
      address: 'School Address',
    },
    labels: {
      schoolName: 'School Name',
      contactName: 'Contact Person Name',
      role: 'Role',
      email: 'Email Address',
      phone: 'Phone Number',
      preferredDate: 'Preferred Program Date',
      address: 'School Address',
      city: 'City',
      state: 'State',
      remarks: 'Additional Remarks (optional)',
    },
    submit: 'Submit Request',
    submitting: 'Submitting…',
    errors: {
      schoolName: 'School name is required',
      contactName: 'Contact name is required',
      role: 'Role is required',
      email: 'Valid email is required',
      phone: 'Valid phone is required',
      street: 'Street is required',
      city: 'City is required',
      state: 'State is required',
    },
  },
  te: {
    heroTitle: 'పాఠశాలల కోసం ధ్యాన కార్యక్రమాలు',
    heroBody:
      'విద్యార్థుల ఏకాగ్రత, భావోద్వేగ సమతుల్యత, వ్యక్తిత్వ వికాసానికి మద్దతు ఇచ్చే సరళమైన, క్రమబద్ధమైన ధ్యాన కార్యక్రమం. ఇది సురక్షితమైన, తటస్థమైన, వయస్సుకు తగిన విధంగా అందించబడుతుంది.',
    heroPoints: [
      'పూర్తిగా ఉచితం మరియు వాణిజ్యరహితం',
      'తటస్థం, అందరికీ అనుకూలం, అన్ని విద్యార్థులకు సరిపడేది',
      'ఏకాగ్రత, ప్రశాంతత, సానుకూల విలువలపై దృష్టి',
      'పాఠశాల సమయాల్లో లేదా ప్రత్యేక సెషన్లలో నిర్వహించవచ్చు',
    ],
    stats: [
      ['100+', 'పాఠశాలలు'],
      ['10K+', 'విద్యార్థులు'],
      ['25+', 'దేశాలు'],
      ['100%', 'ఉచితం'],
    ],
    quote:
      'ప్రతి బిడ్డకు అంతర్గత శాంతి సహజం — ధ్యానం దానిని మళ్లీ కనుగొనడానికి సహాయపడుతుంది, ప్రతి ప్రశాంత శ్వాసతో.',
    whyTitle: 'ఈ రోజుల్లో పిల్లలకు ధ్యానం ఎందుకు అవసరం',
    whyBody:
      'ఈ రోజుల్లో పిల్లలు వారి ఏకాగ్రత, ప్రవర్తన, కమ్యూనికేషన్ నైపుణ్యాలపై ప్రభావం చూపే అనేక ఆధునిక ప్రభావాలకు గురవుతున్నారు. సహజ యోగ ధ్యానం ఈ ప్రభావాలను మృదువుగా తగ్గించి, కరుణ, గౌరవం, భావోద్వేగ సమతుల్యత, ఏకాగ్రత వంటి సహజ గుణాలను వెలికితీస్తుంది.',
    benefitsTitle: 'పిల్లలకు సహజ యోగ ధ్యాన ప్రయోజనాలు',
    benefitsBody:
      'సహజ యోగ ధ్యానం పిల్లల అంతర్ముఖ వికాసాన్ని సహజంగా, సులభంగా, ఆనందంగా అభివృద్ధి చేస్తుంది.',
    benefits: [
      ['సామాజిక నైపుణ్యాలు', 'పిల్లలు పెద్దలతో, స్నేహితులతో గౌరవంగా మాట్లాడడం నేర్చుకుని గుంపులోను వ్యక్తిగతంగాను ఆత్మవిశ్వాసం పొందుతారు.'],
      ['ఆత్మవిశ్వాసం', 'ధ్యానం భయం, ఆందోళన, అసురక్షిత భావాన్ని తగ్గించి సహజ ప్రతిభ, ధైర్యాన్ని వెలికి తీయగలదు.'],
      ['సృజనాత్మకత', 'ప్రశాంతమైన, సమతుల మనస్సు పిల్లల సహజ సృజనాత్మకత, ఆసక్తిని వికసింపజేస్తుంది.'],
      ['జ్ఞాపకశక్తి & ఏకాగ్రత', 'ధ్యానం మనస్సును ప్రశాంతపరచి ఏకాగ్రత, జ్ఞాపకశక్తి, మానసిక స్పష్టతను మెరుగుపరుస్తుంది.'],
    ],
    formTitle: 'పాఠశాల కార్యక్రమం కోసం అభ్యర్థించండి',
    formBody:
      'మీ వివరాలను క్రింద పంచుకోండి. మీ విద్యార్థులకు తగిన కార్యక్రమాన్ని సమన్వయం చేసేందుకు మా బృందం మిమ్మల్ని సంప్రదిస్తుంది.',
    formSections: {
      school: 'పాఠశాల',
      contact: 'సంప్రదింపు వ్యక్తి',
      address: 'పాఠశాల చిరునామా',
    },
    labels: {
      schoolName: 'పాఠశాల పేరు',
      contactName: 'సంప్రదింపు వ్యక్తి పేరు',
      role: 'పాత్ర',
      email: 'ఇమెయిల్ చిరునామా',
      phone: 'ఫోన్ నంబర్',
      preferredDate: 'అభిలషిత కార్యక్రమ తేదీ',
      address: 'పాఠశాల చిరునామా',
      city: 'నగరం',
      state: 'రాష్ట్రం',
      remarks: 'అదనపు వ్యాఖ్యలు (ఐచ్చికం)',
    },
    submit: 'అభ్యర్థనను పంపండి',
    submitting: 'పంపుతోంది…',
    errors: {
      schoolName: 'పాఠశాల పేరు అవసరం',
      contactName: 'సంప్రదింపు పేరు అవసరం',
      role: 'పాత్ర అవసరం',
      email: 'సరైన ఇమెయిల్ అవసరం',
      phone: 'సరైన ఫోన్ నంబర్ అవసరం',
      street: 'వీధి చిరునామా అవసరం',
      city: 'నగరం అవసరం',
      state: 'రాష్ట్రం అవసరం',
    },
  },
} as const;

export default function SchoolRegisterClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = content[locale];
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

    if (!formData.schoolName || formData.schoolName.trim().length < 2) errors['schoolName'] = copy.errors.schoolName;

    if (!formData.contactPerson.name || formData.contactPerson.name.trim().length < 2) errors['contactPerson.name'] = copy.errors.contactName;
    if (!formData.contactPerson.role || formData.contactPerson.role.trim().length < 2) errors['contactPerson.role'] = copy.errors.role;
    if (!emailRe.test(formData.contactPerson.email)) errors['contactPerson.email'] = copy.errors.email;
    if (!phoneRe.test(formData.contactPerson.phone)) errors['contactPerson.phone'] = copy.errors.phone;

    if (!formData.schoolAddress.street || formData.schoolAddress.street.trim().length < 5) errors['schoolAddress.street'] = copy.errors.street;
    if (!formData.schoolAddress.city || formData.schoolAddress.city.trim().length < 2) errors['schoolAddress.city'] = copy.errors.city;
    if (!formData.schoolAddress.state || formData.schoolAddress.state.trim().length < 2) errors['schoolAddress.state'] = copy.errors.state;

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
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_15%_20%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_60%),radial-gradient(45%_60%_at_90%_90%,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-[var(--gutter)] py-[clamp(56px,8vh,88px)] md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">School Programs</p>
            <h1 className="mt-4 font-display text-[clamp(30px,3.8vw,44px)] leading-[1.12] tracking-[-0.015em] text-[color:var(--ink)]">
              {copy.heroTitle}
            </h1>

            <p className="mt-6 max-w-xl text-[15.5px] leading-[1.8] text-[color:var(--muted)]">
              {copy.heroBody}
            </p>

            <ul className="mt-8 space-y-3 text-[14.5px] text-[color:var(--muted)]">
              {copy.heroPoints.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--accent)]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative">
              <div aria-hidden className="absolute -right-5 -top-5 h-24 w-24 rotate-45 border border-[color:color-mix(in_srgb,var(--accent)_30%,transparent)]" />
              <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-panel">
                <Image
                  src="/school.jpeg"
                  alt="Students meditation session"
                  width={1200}
                  height={800}
                  className="h-full w-full rounded-[var(--radius-lg)] object-cover"
                  priority
                />
              </div>
              <div aria-hidden className="absolute -bottom-4 -left-4 -z-10 h-28 w-28 rounded-[var(--radius-md)] border border-[color:color-mix(in_srgb,var(--accent)_40%,transparent)]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="mx-auto max-w-[1200px] px-[var(--gutter)] pb-[clamp(48px,6vh,64px)]">
        <Reveal>
          <div className="grid grid-cols-2 gap-y-8 rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_96%,transparent),color-mix(in_srgb,var(--surface-2)_88%,transparent))] px-6 py-10 shadow-card md:grid-cols-4">
            {copy.stats.map(([value, label], index) => (
              <div key={label} className={`flex flex-col items-center gap-1.5 px-4 text-center ${index > 0 ? 'md:border-l md:border-[color:var(--border)]' : ''}`}>
                <CountUp
                  value={value.endsWith('K') ? Math.round(parseFloat(value) * 1000) : parseInt(value, 10)}
                  suffix={value.includes('%') ? '%' : '+'}
                  className="font-display text-[clamp(28px,3.4vw,40px)] leading-none text-[color:var(--ink)]"
                />
                <p className="text-[13px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CONTEXT */}
      <section className="mx-auto max-w-[900px] px-[var(--gutter)] pb-[clamp(48px,6vh,72px)]">
        <Reveal>
          <div className="rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-card md:p-10">
            <p className="eyebrow">Why Meditation</p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(24px,2.8vw,32px)] leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
              {copy.whyTitle}
            </h2>

            <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
              {copy.whyBody}
            </p>
          </div>
        </Reveal>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-[900px] px-[var(--gutter)] pb-[clamp(48px,6vh,72px)]">
        <Reveal>
          <blockquote className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[color:color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-2)_92%,transparent),color-mix(in_srgb,var(--surface)_96%,transparent))] p-8 shadow-card md:p-12">
            <span aria-hidden className="pointer-events-none absolute -left-2 -top-8 select-none font-display text-[120px] leading-none text-[color:color-mix(in_srgb,var(--accent)_25%,transparent)]">“</span>
            <p className="relative font-display text-[clamp(20px,2.4vw,27px)] leading-[1.45] tracking-[-0.01em] text-[color:var(--ink)]">
              {copy.quote}
            </p>
            <footer className="mt-5 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent)]" aria-hidden />
              <span className="text-[13px] uppercase tracking-[0.2em] text-[color:var(--muted)]">Sahaja Yoga Meditation</span>
            </footer>
          </blockquote>
        </Reveal>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-[1200px] px-[var(--gutter)] pb-[clamp(48px,6vh,72px)]">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-center font-display text-[clamp(26px,3vw,34px)] leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
            {copy.benefitsTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-center text-[color:var(--muted)]">
            {copy.benefitsBody}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {copy.benefits.map(([title, text], index) => (
            <Reveal key={title} delay={index * 80}>
              <InfoCard icon={BENEFIT_ICONS[index % BENEFIT_ICONS.length]} title={title} text={text} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-[860px] px-[var(--gutter)] pb-28">
        <Reveal>
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-panel md:p-12">
          <p className="eyebrow">Request a Program</p>
          <h2 className="mt-4 font-display text-[clamp(24px,2.8vw,32px)] leading-[1.2] tracking-[-0.01em] text-[color:var(--ink)]">
            {copy.formTitle}
          </h2>

          <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
            {copy.formBody}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {formSectionLabel(copy.formSections.school)}
            <Input label={copy.labels.schoolName} error={errors['schoolName']} onChange={(v) => setFormData({ ...formData, schoolName: v })} />
            <Input label={copy.labels.contactName} error={errors['contactPerson.name']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, name: v } })
            } />
            <Input label={copy.labels.role} error={errors['contactPerson.role']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, role: v } })
            } />
            <Input label={copy.labels.email} type="email" error={errors['contactPerson.email']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, email: v } })
            } />
            {formSectionLabel(copy.formSections.contact)}
            <Input label={copy.labels.phone} error={errors['contactPerson.phone']} onChange={(v) =>
              setFormData({ ...formData, contactPerson: { ...formData.contactPerson, phone: v } })
            } />

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">
                {copy.labels.preferredDate}
              </label>
              <DatePicker
                selected={formData.preferredProgramDate}
                onChange={(date) =>
                  setFormData({ ...formData, preferredProgramDate: date || new Date() })
                }
                className="mt-1 admin-input w-full"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            
            {formSectionLabel(copy.formSections.address)}
            <Input label={copy.labels.address} className="md:col-span-2" error={errors['schoolAddress.street']} onChange={(v) =>
              setFormData({ ...formData, schoolAddress: { ...formData.schoolAddress, street: v } })
            } />

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">{copy.labels.city}</label>
              <CityPicker
                value={formData.schoolAddress.city}
                onChange={(v) => setFormData({ ...formData, schoolAddress: { ...formData.schoolAddress, city: v } })}
                className={`mt-1 w-full ${errors['schoolAddress.city'] ? '!border-[color:var(--danger)]' : ''}`}
              />
              {errors['schoolAddress.city'] && <p className="mt-1 text-[13.5px] text-[color:var(--danger)]">{errors['schoolAddress.city']}</p>}
            </div>

            <Input label={copy.labels.state} error={errors['schoolAddress.state']} onChange={(v) =>
              setFormData({ ...formData, schoolAddress: { ...formData.schoolAddress, state: v } })
            } />

            <div className="md:col-span-2">
              <label className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">
                {copy.labels.remarks}
              </label>
              <textarea
                rows={4}
                className="mt-1 admin-input w-full resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, additionalRemarks: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary mt-10 w-full"
          >
            {loading && <LoadingSpinner />}
            {loading ? copy.submitting : copy.submit}
          </button>
        </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

const BENEFIT_ICONS = [FiUsers, FiFeather, FiStar, FiBookOpen];

function formSectionLabel(label: string) {
  return (
    <div className="col-span-full -mb-3 flex items-center gap-3 border-b border-[color:var(--border)] pb-2.5">
      <span className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent)]" aria-hidden />
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">{label}</p>
    </div>
  );
}

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
      <label className="mb-2 block text-[14px] font-medium text-[color:var(--muted)]">{label}</label>
      <input
        type={type}
        className={`admin-input w-full ${error ? '!border-[color:var(--danger)]' : ''}`}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1.5 text-[13.5px] text-[color:var(--danger)]">{error}</p>}
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="h-full rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-panel">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] border border-[color:color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] text-[color:var(--accent)]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-5 font-display text-[19px] leading-snug text-[color:var(--ink)]">{title}</h3>
      <p className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--muted)]">{text}</p>
    </div>
  );
}
