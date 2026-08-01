'use client';

import { useEffect, useState } from 'react';
import { useInView } from './useInView';

type CountUpProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * rAF-driven eased counter that starts when scrolled into view.
 * Uses Indian locale formatting (en-IN) for grouped numerals.
 */
export default function CountUp({
  value,
  suffix = '',
  duration = 1400,
  className = '',
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value).toLocaleString('en-IN'));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`numeric-font ${className}`}>
      {display}
      {suffix}
    </span>
  );
}
