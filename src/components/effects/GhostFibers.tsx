import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

type GhostFibersProps = {
  /** Number of fibers. Keep low on mobile-heavy surfaces. */
  count?: number;
  /** Light fibers for dark surfaces, dark fibers for light surfaces. */
  tone?: 'light' | 'dark';
  opacity?: number;
  className?: string;
};

const seeded = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

/**
 * Ghost Fibers — extremely subtle threads of light suggesting a network of
 * learners, mentors and partners. Pure SVG + CSS so it stays cheap to render.
 */
export function GhostFibers({
  count = 12,
  tone = 'light',
  opacity = 0.5,
  className = ''
}: GhostFibersProps) {
  const reduceMotion = useReducedMotion();

  const fibers = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const r1 = seeded(index + 1);
      const r2 = seeded(index + 7.3);
      const r3 = seeded(index + 13.7);

      const startY = 60 + r1 * 680;
      const endY = 40 + r2 * 720;
      const c1y = startY - 220 + r3 * 440;
      const c2y = endY - 200 + r1 * 400;
      const width = 0.6 + r2 * 1.1;
      const duration = 26 + r3 * 34;
      const delay = -(r1 * 30);

      return {
        id: `fiber-${index}`,
        d: `M -80 ${startY.toFixed(1)} C 320 ${c1y.toFixed(1)}, 860 ${c2y.toFixed(
          1
        )}, 1280 ${endY.toFixed(1)}`,
        width,
        duration,
        delay,
        dash: `${(90 + r2 * 260).toFixed(0)} ${(240 + r3 * 420).toFixed(0)}`
      };
    });
  }, [count]);

  const stroke = tone === 'light' ? 'url(#fiberLight)' : 'url(#fiberDark)';

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
          <linearGradient id="fiberLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="35%" stopColor="#8AB4FF" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#A78BFA" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fiberDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3155FF" stopOpacity="0" />
            <stop offset="40%" stopColor="#3155FF" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#7C3AED" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {fibers.map((fiber) =>
        <path
          key={fiber.id}
          d={fiber.d}
          stroke={stroke}
          strokeWidth={fiber.width}
          strokeLinecap="round"
          strokeDasharray={fiber.dash}
          style={
          reduceMotion ?
          undefined :
          {
            animation: `forozDash ${fiber.duration}s linear infinite`,
            animationDelay: `${fiber.delay}s`
          }
          } />

        )}
      </svg>
    </div>);

}