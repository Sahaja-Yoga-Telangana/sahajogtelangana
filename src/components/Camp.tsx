'use client';

import Image from "next/image";
import Button from "./Button";
import { useTranslations } from '@/app/provider/localeProvider';

interface CampProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
}

const CampSite = ({ backgroundImage, title, subtitle }: CampProps) => {
  return (
    <div className={`h-full w-full min-w-[900px] ${backgroundImage} bg-cover bg-no-repeat rounded-[28px] border border-[color:var(--border)] overflow-hidden`}>
      <div className="flex h-full flex-col items-start justify-end p-6 lg:px-10 lg:py-10 bg-gradient-to-t from-black/55 via-black/25 to-transparent">
        <div className="flexCenter gap-4">
          <div className="rounded-full bg-black/90 p-3">
            <Image
              src="/folded-map.svg"
              alt="map"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-white text-lg font-semibold">{title}</h4>
            <p className="text-white/80 text-base">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Camp = () => {
  const t = useTranslations();

  return (
    <section className="relative py-10">
      <hr/>
      <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10">
        
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[color:var(--ink)]">{t('camp.title')}</h2>
          <p className="mt-3 text-[color:var(--muted)] max-w-3xl">
            {t('camp.body')}
          </p>
        </div>
        <div className="hide-scrollbar flex h-[300px] w-full items-start justify-start gap-6 overflow-x-auto lg:h-[360px]">
          <CampSite
            backgroundImage="bg-bg-img-2"
            title={t('camp.center_title')}
            subtitle=""
          />
          <CampSite
            backgroundImage="bg-bg-img-3"
            title={t('camp.center_title')}
            subtitle=""
          />
          <CampSite
            backgroundImage="bg-bg-img-1"
            title={t('camp.center_title')}
            subtitle=""
          />
        </div>
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
