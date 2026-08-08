'use client';

import Image from "next/image";
import Button from "./Button";
import SectionTitle from './SectionTitle';
import Reveal from '@/components/motion/Reveal';
import { useTranslations } from '@/app/provider/localeProvider';

interface CampProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
}

const CampSite = ({ backgroundImage, title, subtitle }: CampProps) => {
  return (
    <div
      className={`h-full w-full min-w-[780px] max-md:min-w-[86vw] ${backgroundImage} bg-cover bg-no-repeat rounded-[var(--radius-xl)] border border-[color:var(--border)] overflow-hidden snap-start`}
    >
      <div className="flex h-full flex-col items-start justify-end p-6 lg:px-10 lg:py-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-black/80 p-3 backdrop-blur-sm">
            <Image
              src="/folded-map.svg"
              alt="map"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-white text-lg font-semibold">{title}</h4>
            <p className="text-white/80 text-[15px]">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Camp = () => {
  const t = useTranslations();

  return (
    <section className="relative py-[clamp(72px,9vh,104px)]">
      <div className="mx-auto max-w-[1200px] px-[var(--gutter)]">
        <SectionTitle
          title={t('camp.title')}
          eyebrow={t('camp.eyebrow')}
          body={t('camp.body')}
          align="left"
        />

        <Reveal delay={100}>
          <div className="hide-scrollbar flex h-[320px] w-full items-start justify-start gap-6 overflow-x-auto snap-x snap-mandatory lg:h-[400px] [scrollbar-width:thin] [scrollbar-color:var(--accent)_transparent]">
            <CampSite
              backgroundImage="bg-bg-img-2"
              title={t('camp.center_title')}
              subtitle={t('camp.center_subtitle')}
            />
            <CampSite
              backgroundImage="bg-bg-img-3"
              title={t('camp.center_title')}
              subtitle={t('camp.center_subtitle')}
            />
            <CampSite
              backgroundImage="bg-bg-img-1"
              title={t('camp.center_title')}
              subtitle={t('camp.center_subtitle')}
            />
          </div>
        </Reveal>

        <div className="flex justify-center mt-10">
          <Button
            type="button"
            title={t('camp.cta')}
            variant="primary"
            href="/centers"
          />
        </div>
      </div>
    </section>
  )
}

export default Camp
