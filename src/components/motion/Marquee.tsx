'use client';

type MarqueeProps = {
  items: React.ReactNode[];
  className?: string;
  speed?: string;
};

/**
 * Seamless infinite marquee. Items are duplicated so translateX(-50%) loops
 * perfectly. Edge-masked, pauses on hover, static under reduced motion.
 */
export default function Marquee({ items, className = '', speed = '32s' }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={`marquee ${className}`}>
      <div
        className="marquee-track"
        style={{ animationDuration: speed }}
        aria-hidden={items.length > 4 ? true : undefined}
      >
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
