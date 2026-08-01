'use client';

import { useInView } from './useInView';

type RevealVariant = 'fade-up' | 'fade' | 'scale' | 'slide-left' | 'slide-right';

type RevealTag = 'div' | 'section' | 'span' | 'p' | 'h2' | 'h3' | 'li' | 'article';

type RevealProps = {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  as?: RevealTag;
};

/**
 * Zero-dependency scroll reveal. Plays once when the element enters the
 * viewport. Renders statically under prefers-reduced-motion (CSS handles it).
 */
export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={variant}
      className={`${inView ? 'is-visible ' : ''}${className}`}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
