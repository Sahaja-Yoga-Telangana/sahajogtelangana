import React from 'react';
import Reveal from '@/components/motion/Reveal';

interface SectionTitleProps {
  title: string;
  eyebrow?: string;
  body?: string;
  align?: 'center' | 'left';
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  eyebrow,
  body,
  align = 'center',
}) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <Reveal className={`flex flex-col ${alignment} mb-12`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-[clamp(28px,3.4vw,40px)] font-display leading-[1.15] tracking-[-0.015em] text-[color:var(--ink)]">
        {title}
      </h2>
      <div className={`mt-5 flex items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
        <div className="h-[2px] w-16 bg-[color:var(--accent)]"></div>
        <div className="h-1.5 w-1.5 rotate-45 bg-[color:var(--accent)]"></div>
      </div>
      {body ? (
        <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--muted)]">
          {body}
        </p>
      ) : null}
    </Reveal>
  );
};

export default SectionTitle;
