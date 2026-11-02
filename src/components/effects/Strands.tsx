import { useId, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

type StrandsProps = {
  count?: number;
  tone?: 'light' | 'dark';
  opacity?: number;
  className?: string;
};

/**
 * Strands — long, slowly travelling threads that read as a continuous line
 * from education to skills to opportunity to people to collaboration.
 */
export function Strands({
  count = 5,
  tone = 'light',
  opacity = 0.55,
  className = ''
}: StrandsProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId();

  const strands = useMemo(
    () =>
    Array.from({ length: count }).map((_, index) => {
      const base = 140 + index * 120;
      const amp = 70 + index * 18;

      return {
        id: `strand-${index}`,
        d: `M -60 ${base} C 200 ${base - amp}, 420 ${base + amp}, 620 ${base} S 1000 ${
        base - amp}, 1260 ${
        base + amp / 2}`,
        duration: 30 + index * 9,
        delay: -index * 6,
        width: index % 2 === 0 ? 1.4 : 0.9
      };
    }),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}>
      
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none">
        
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor={tone === 'light' ? 'rgb(var(--brand-light-rgb))' : 'rgb(var(--brand-rgb))'}
              stopOpacity="0" />
            
            <stop
              offset="30%"
              stopColor={tone === 'light' ? 'rgb(var(--brand-light-rgb))' : 'rgb(var(--brand-rgb))'}
              stopOpacity={tone === 'light' ? 0.65 : 0.3} />
            
            <stop
              offset="65%"
              stopColor={tone === 'light' ? 'rgb(var(--brand-light-rgb))' : 'rgb(var(--brand-rgb))'}
              stopOpacity={tone === 'light' ? 0.5 : 0.24} />
            
            <stop
              offset="100%"
              stopColor={tone === 'light' ? 'rgb(var(--brand-light-rgb))' : 'rgb(var(--brand-rgb))'}
              stopOpacity="0" />
            
          </linearGradient>
        </defs>

        {strands.map((strand) =>
        <path
          key={strand.id}
          d={strand.d}
          stroke={`url(#${gradientId})`}
          strokeWidth={strand.width}
          strokeLinecap="round"
          strokeDasharray="420 900"
          style={
          reduceMotion ?
          undefined :
          {
            animation: `forozDash ${strand.duration}s linear infinite`,
            animationDelay: `${strand.delay}s`
          }
          } />

        )}
      </svg>
    </div>);

}