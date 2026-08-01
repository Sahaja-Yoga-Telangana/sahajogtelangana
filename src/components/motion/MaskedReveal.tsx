'use client';

import { useEffect, useState } from 'react';
import { useInView } from './useInView';

type MaskedTag = 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p' | 'span';

type MaskedRevealProps = {
  text: string;
  as?: MaskedTag;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Editorial masked word-reveal for headlines. Words rise out of an overflow
 * mask with a 35ms stagger once the heading scrolls into view. Falls back to
 * plain text during SSR / first render (no flash), and to static text under
 * prefers-reduced-motion.
 */
export default function MaskedReveal({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  id,
}: MaskedRevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });
  const [parts, setParts] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setParts(text.split(/(\s+)/).filter(Boolean));
    setMounted(true);
  }, [text]);

  return (
    <Tag ref={ref as React.Ref<never>} id={id} aria-label={text} className={className}>
      {!mounted || parts.length === 0
        ? text
        : parts.map((part, i) =>
            !part.trim() ? (
              <span key={i}>&nbsp;</span>
            ) : (
              <span
                key={i}
                className="masked-reveal-word"
                aria-hidden="true"
                style={{ transitionDelay: `${delay + i * 35}ms` }}
              >
                <span
                  className="masked-reveal-inner"
                  style={{
                    transitionDelay: `${delay + i * 35}ms`,
                    transform: inView ? 'translateY(0)' : 'translateY(115%)',
                  }}
                >
                  {part}
                </span>
              </span>
            )
          )}
    </Tag>
  );
}
