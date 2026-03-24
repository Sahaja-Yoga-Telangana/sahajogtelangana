import Image from 'next/image'
import React from 'react'
import Button from './Button'

const Guide = () => {
  return (
    <section className="py-20 bg-[color:var(--surface-2)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image */}
          <div className="lg:w-5/12 flex justify-center">
            <Image
              src="/maaaa.jpg"
              alt="Shri Mataji"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="lg:w-6/12 space-y-6">
            <p className="uppercase tracking-[0.3em] text-base font-semibold text-[color:var(--muted)]">
              Our Mother
            </p>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-semibold text-[color:var(--ink)]">Shri Mataji</h2>
              <Button
                type="button"
                title="Know More"
                icon="/play.svg"
                variant="secondary"
              />
            </div>
            <p className="text-[color:var(--muted)] text-lg leading-relaxed">
              Shri Mataji Nirmala Devi was an extraordinarily charismatic and compassionate spiritual figure. Her presence radiated pure love — a divine force that saw the potential in every human soul. She addressed the seekers of truth with deep care, often transforming their confusion into clarity and silence with a single glance. Her legacy is not just in words, but in the awakening she offered to thousands around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Sahaja Corporate Section */}
      <div className="container mx-auto px-6 mt-24 relative">
        <Image
          src="/corporate-bg.svg"
          alt="Corporate wellness and meditation"
          width={1440}
          height={380}
          className="w-full h-auto object-cover rounded-xl shadow-md"
        />

        <div
          className="
            relative
            lg:absolute lg:left-16 lg:top-16
            bg-[color:var(--surface)]
            border border-[color:var(--border)]
            p-6 sm:p-8
            rounded-2xl
            shadow-soft
            max-w-xl
            mx-auto lg:mx-0
            -mt-16 sm:-mt-20 lg:mt-0
            flex flex-col
          "
        >
          {/* Heading */}
          <h2
            className="
              text-2xl sm:text-3xl
              font-semibold
              text-[color:var(--ink)]
              leading-snug
              mb-3
            "
          >
            Sahaja Yoga for Corporate
          </h2>

          {/* Description */}
          <p
            className="
              text-sm sm:text-base
              text-[color:var(--muted)]
              leading-relaxed
              mb-6
            "
          >
            Sahaja Yoga for Corporate offers simple, practical meditation sessions
            designed to help employees achieve mental balance, emotional well-being,
            and sustained focus. Through self-realization and thoughtless awareness,
            participants experience reduced stress, improved clarity, and enhanced
            workplace harmony.
          </p>

          {/* CTA – moved below content on mobile */}
          <div className="mb-3 justify-center sm:justify-start">
            <Button
              type="button"
              title="Corporate Program"
              variant="secondary"
              full
            />
          </div>

          {/* Divider (mobile only) */}
          <div className="h-px bg-[color:var(--border)] mb-6 sm:hidden" />

          {/* Impact Title */}
          <h3
            className="
              text-lg sm:text-xl
              font-semibold
              text-[color:var(--ink)]
              text-center
              mb-4
            "
          >
            Our Impact
          </h3>

          {/* Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Organizations Served', value: '300+' },
              { label: 'Employees Benefited', value: '50K+' },
              { label: 'Countries Covered', value: '25+' },
              { label: 'Years of Experience', value: '30+' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl font-semibold text-[color:var(--ink)]">
                  {item.value}
                </p>
                <p className="text-sm text-[color:var(--muted)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default Guide
