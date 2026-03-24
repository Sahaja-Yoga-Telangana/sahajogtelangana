// pages/shri-mataji.tsx

import Image from 'next/image';

export default function ShriMatajiPage() {
  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--muted)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
        <p className="text-sm uppercase tracking-[0.3em] text-center text-[color:var(--muted)]">
          The Founder
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-[color:var(--ink)] mb-10">
          Shri Mataji Nirmala Devi
        </h1>

        {/* Founder */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <Image
                src="/maa-wide.jpg"
                alt="Shri Mataji Nirmala Devi"
                width={640}
                height={420}
                className="rounded-2xl shadow-soft"
                priority
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
                Founder of Sahaja Yoga
              </h2>
              <p className="mb-4">
                Shri Mataji discovered a unique method of meditation called Sahaja Yoga that enables inner
                enlightenment and reveals the true potential of humanity. She devoted her entire life to
                sharing this experience, and today hundreds of thousands of people around the world practice
                Sahaja Yoga.
              </p>
              <p className="mb-4">
                She taught that a motherly spiritual energy, Kundalini, exists within every person. When awakened,
                it leads to a state of spontaneous meditation and deep inner peace.
              </p>
            </div>
          </div>
        </section>

        {/* Great Master */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4 text-center">
            The great master of yoga
          </h2>
          <p className="mb-4 text-center max-w-3xl mx-auto">
            Shri Mataji showed that a motherly spiritual energy called Kundalini exists within each person, and
            that its awakening leads to spontaneous meditation. She was able to awaken this energy in thousands
            of people, which distinguishes Sahaja Yoga from other methods and helps reveal our best qualities.
          </p>
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft bg-[color:var(--surface)]">
              <Image
                src="/maa-landscape.jpg"
                alt="Shri Mataji Nirmala Devi smiling"
                width={1200}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Social Work */}
        <section className="mb-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
              A life dedicated to humanity
            </h2>
            <p className="mb-4">
              Shri Mataji founded and supported many non‑profit initiatives: centers for destitute women and
              orphans, international schools with a balanced curriculum, health centers applying Sahaja Yoga,
              and academies teaching classical arts.
            </p>
            <p className="mb-4">
              Her vision was always to offer inner transformation freely, without dogma, so each person could
              discover what is beneficial for their own spiritual development.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
              Life among great people
            </h2>
            <p className="mb-4">
              Shri Mataji was raised among scholars and political activists involved in India’s liberation movement,
              and Mahatma Gandhi recognized her exceptional spiritual potential.
            </p>
            <p className="mb-4">
              Her husband, Sir C. P. Srivastava, rose through public service to become Private Secretary to India’s
              Prime Minister and later served as Secretary‑General of the International Maritime Organization.
            </p>
          </div>
        </section>

        {/* Early Years */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
                Early years
              </h2>
              <p className="mb-4">
                Shri Mataji was born as Nirmala Salve on March 21, 1923, in Chindwara, India. Her family descended
                from the Shalivahana dynasty. Her forefathers converted from Hinduism to Christianity, and she was
                raised Christian. Her parents were deeply involved in
                India’s independence movement.
              </p>
              <p className="mb-4">
                Her father was a lawyer and scientist, fluent in many languages and known for translating the Qur’an
                into Hindi. Her mother was the first woman in India to receive an honors degree in mathematics.
              </p>
              <p className="mb-4">
                As a teenager she participated in the liberation movement and was detained by British soldiers. In
                1947, she married Chandrika Prasad Srivastava, later known as Sir C. P. Srivastava, and they had two daughters.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft bg-[color:var(--surface)]">
              <Image
                src="/maa-wide2.jpg"
                alt="Shri Mataji Nirmala Devi"
                width={1200}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Founding */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
            The founding of Sahaja Yoga
          </h2>
          <p className="mb-4">
            Shri Mataji sought a way to help people reach a higher awareness of themselves. After deep contemplation,
            she experienced the awakening of her Kundalini and the opening of the Sahasrara in May 1970. She then
            discovered the method of meditation she later named “Sahaja Yoga,” meaning “spontaneous union.”
          </p>
          <p className="mb-4">
            She began teaching this method to a few individuals, awakening their Kundalinis and giving them
            Self‑Realisation. Over time, thousands experienced inner freedom and a cool breeze on their palms and
            above the head.
          </p>
        </section>

        {/* Sharing & Vision */}
        <section className="mb-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
              Sharing the experience
            </h2>
            <p className="mb-4">
              After moving to London, Shri Mataji taught Sahaja Yoga publicly, offered lectures and interviews, and
              gave individual attention to seekers. She never charged for Self‑Realisation, insisting it is the
              birthright of every person.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
              A global vision
            </h2>
            <p className="mb-4">
              From the 1980s onward she travelled across Europe, North America, Australia, South America, Asia,
              and the Pacific region, sharing Sahaja Yoga with people of all backgrounds.
            </p>
          </div>
        </section>

        {/* Education & Arts */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
                Education and the arts
              </h2>
              <p className="mb-4">
                Shri Mataji emphasized education grounded in moral and spiritual growth. She created schools based on
                Sahaja Yoga and highlighted the value of discipline based on love and respect.
              </p>
              <p className="mb-4">
                In the arts, she supported Indian classical traditions and helped establish an Academy of Arts in
                Maharashtra (India). Students from many countries study music, dance, and painting there, and she also
                supported humanitarian projects such as the Nirmala Prem Center for orphans.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft bg-[color:var(--surface)]">
              <Image
                src="/maa-landscape2.jpg"
                alt="Shri Mataji Nirmala Devi smiling"
                width={1200}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Health */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
            A holistic approach to health
          </h2>
          <p className="mb-4">
            Shri Mataji studied how meditation affects the subtle energy system of chakras and channels and how
            balance can be restored through Kundalini awakening. She emphasized that while Sahaja Yoga may improve
            health, its goal is spiritual awakening.
          </p>
          <p className="mb-4">
            Dr. Ramesh Manocha cited positive effects of Sahaja Yoga meditation for conditions such as hypertension,
            asthma, and ADD. In 1996, Shri Mataji founded the Sahaja Yoga International Research & Wellness Center
            in Belapur near Mumbai, integrating Sahaja Yoga with Ayurvedic practices.
          </p>
        </section>

        {/* Creativity & Culture */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">
            Pure creativity
          </h2>
          <p className="mb-4">
            Shri Mataji saw art as a means of self‑expression and a way to preserve world cultures. She supported
            artists and helped create spaces where classical traditions could flourish.
          </p>
        </section>

        {/* Quote */}
        <section className="text-center">
          <blockquote className="italic text-[color:var(--muted)]">
            “They must take care of this world.”
          </blockquote>
          <p className="mt-2 text-sm text-[color:var(--muted)]">— Shri Mataji Nirmala Devi</p>
        </section>
      </div>
    </div>
  );
}
