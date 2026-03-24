import Image from 'next/image';

export default function AboutSahajaYogaPage() {
  return (
    <main className="bg-[color:var(--bg)]">

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-[color:var(--accent-200)]/60 text-[color:var(--ink)] text-base font-medium">
          Meditation • Self-Realization • Inner Peace
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--ink)] tracking-tight">
          Sahaja Yoga Meditation
        </h1>

        <p className="mt-8 text-lg text-[color:var(--muted)] max-w-4xl mx-auto leading-relaxed">
          Sahaja Yoga is a unique meditation method that enables a spontaneous
          experience of self-realization — a state of thoughtless awareness,
          inner silence, and deep peace that unfolds naturally from within.
        </p>
      </section>

      {/* ================= WHAT IS SAHAJA YOGA ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-6">
            What is Sahaja Yoga?
          </h2>

          <p className="text-[color:var(--muted)] leading-relaxed mb-5">
            Sahaja Yoga is a unique method of meditation founded by
            <strong> Shri Mataji Nirmala Devi</strong> in 1970. It involves the
            awakening of the dormant spiritual energy known as
            <em> Kundalini</em>, which resides within every human being.
          </p>

          <p className="text-[color:var(--muted)] leading-relaxed mb-5">
            Once awakened, this energy rises through the subtle energy system,
            resulting in a spontaneous state of meditation and a tangible
            experience of self-realization.
          </p>

          <p className="text-[color:var(--muted)] leading-relaxed">
            The word <strong>Sahaja</strong> means “born with”, and
            <strong> Yoga</strong> means “union”. Sahaja Yoga therefore refers
            to the innate union with the all-pervading power that exists within
            every individual.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-soft">
          <Image
            src="/sahaja5.jpg"
            alt="What is Sahaja Yoga"
            width={600}
            height={420}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </section>

      {/* ================= VIDEO ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-10">
          Your First Meditation with Shri Mataji
        </h2>

        <div className="youtube-container rounded-3xl shadow-soft overflow-hidden ring-1 ring-black/5">
          <iframe
            src="https://www.youtube.com/embed/hcSJrufqdq0"
            title="Your First Meditation with Shri Mataji"
            allowFullScreen
          />
        </div>
      </section>

      {/* ================= DIFFERENT ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="bg-[color:var(--surface)] backdrop-blur rounded-3xl p-10 md:p-14 shadow-soft grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-6">
              How is Sahaja Yoga Different?
            </h2>

            <p className="text-[color:var(--muted)] leading-relaxed mb-5">
              Sahaja Yoga does not require concentration, chanting, affirmations,
              or rigorous mental discipline. The experience of meditation
              happens naturally and effortlessly.
            </p>

            <p className="text-[color:var(--muted)] leading-relaxed mb-5">
              It allows the practitioner to go beyond thoughts and experience
              a state of inner silence, clarity, and balance — without effort.
            </p>

            <p className="text-[color:var(--muted)] leading-relaxed">
              Sahaja Yoga is practiced free of cost worldwide and empowers
              individuals to become their own masters through direct experience.
            </p>
          </div>

          <Image
            src="/sahaja2.jpg"
            alt="How Sahaja Yoga is different"
            width={600}
            height={420}
            className="rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* ================= ORIGINS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <Image
          src="/sahaja3.jpg"
          alt="Shri Mataji Nirmala Devi"
          width={600}
          height={420}
          className="rounded-3xl shadow-soft"
        />

        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-6">
            Origins of Sahaja Yoga
          </h2>

          <p className="text-[color:var(--muted)] leading-relaxed">
            Shri Mataji Nirmala Devi, born in 1923 in Chhindwara, India,
            dedicated her life to awakening the innate spiritual potential
            of humanity. Observing the deep inner seeking in people,
            she introduced Sahaja Yoga in 1970 as a means for true inner
            transformation.
          </p>

          <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
            Today, Sahaja Yoga is practiced in more than 95 countries,
            offering free meditation sessions to millions across cultures,
            religions, and backgrounds.
          </p>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-12">
          Benefits of Sahaja Yoga Meditation
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <BenefitCard
            title="Mental & Emotional Balance"
            text="Regular meditation reduces stress, anxiety, and emotional instability, allowing practitioners to remain calm and balanced in daily life."
          />
          <BenefitCard
            title="Improved Attention & Self-Control"
            text="Scientific studies show improved attention, self-regulation, and clarity of thought among long-term practitioners."
          />
          <BenefitCard
            title="Holistic Well-Being"
            text="Sahaja Yoga supports physical, emotional, and mental health and is used as a complementary approach in managing various conditions."
          />
        </div>
      </section>

      {/* ================= AWARDS ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-8">
          Awards & Global Recognition
        </h2>

        <div className="bg-[color:var(--surface)] rounded-2xl p-8 shadow-soft border border-gray-100">
          <ul className="space-y-3 text-[color:var(--muted)] leading-relaxed">
            <li>• 1986 — Personality of the Year, Italy</li>
            <li>• 1989 — Government-sponsored medical research, Russia</li>
            <li>• 1990–1994 — Invited by the United Nations to speak on world peace</li>
            <li>• 2003 — Best regenerative therapy, Russian Ministry of Health</li>
            <li>• 2006 — Honorary Citizenship of Cabella Ligure, Italy</li>
          </ul>
        </div>
      </section>

      {/* ================= SCIENCE ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[color:var(--ink)] mb-6">
          Scientific Research on Sahaja Yoga
        </h2>

        <p className="text-[color:var(--muted)] leading-relaxed text-center max-w-4xl mx-auto">
          Scientific research using MRI scans, EEG studies, and clinical trials
          has demonstrated that Sahaja Yoga meditation enhances brain regions
          associated with attention, emotional regulation, compassion, and
          self-control. Clinical studies have also shown positive outcomes in
          managing asthma, epilepsy, ADHD, and depression.
        </p>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center pb-32 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--ink)] mb-4">
          Experience It for Yourself
        </h2>
        <p className="text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Sahaja Yoga offers a direct, experiential path to inner peace and
          self-realization — freely available to all, without obligation.
        </p>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-[color:var(--surface)] rounded-2xl p-7 shadow-soft border border-gray-100 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-[color:var(--ink)]">{title}</h3>
      <p className="mt-4 text-[color:var(--muted)] text-base leading-relaxed">{text}</p>
    </div>
  );
}
