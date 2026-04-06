'use client';

import Image from 'next/image'
import React from 'react'
import Button from './Button'
import { useTranslations } from '@/app/provider/localeProvider';

const Guide = () => {
  const t = useTranslations();

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
              {t('guide.our_mother')}
            </p>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-semibold text-[color:var(--ink)]">{t('guide.shri_mataji')}</h2>
              <Button
                type="button"
                title={t('guide.know_more')}
                icon="/play.svg"
                variant="secondary"
                href="/shri-mataji"
              />
            </div>
            <p className="text-[color:var(--muted)] text-lg leading-relaxed">
              {t('guide.shri_mataji_body')}
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
            {t('guide.corporate_title')}
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
            {t('guide.corporate_body')}
          </p>

          {/* CTA – moved below content on mobile */}
          <div className="mb-3 justify-center sm:justify-start">
            <Button
              type="button"
              title={t('guide.corporate_cta')}
              variant="secondary"
              full
              href="/corporate-register"
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
            {t('guide.impact')}
          </h3>

          {/* Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: t('guide.orgs'), value: '300+' },
              { label: t('guide.employees'), value: '50K+' },
              { label: t('guide.countries'), value: '25+' },
              { label: t('guide.years'), value: '30+' },
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
