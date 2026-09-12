import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type MagicRingsProps = {
  /** Number of concentric rings. */
  rings?: number;
  tone?: 'light' | 'dark';
  /** Enable gentle pointer parallax. */
  interactive?: boolean;
  className?: string;
};

/**
 * Magic Rings — slow, low-contrast concentric energy rings that sit behind
 * content to create depth. Pointer parallax is opt-in and very restrained.
 */
export function MagicRings({
  rings = 5,
  tone = 'light',
  interactive = true,
  className = ''
}: MagicRingsProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 40, damping: 20, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 40, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (!interactive || reduceMotion) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(relX * 26);
      pointerY.set(relY * 26);
    };

    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    const parent = node.parentElement || node;
    parent.addEventListener('pointermove', handlePointerMove);
    parent.addEventListener('pointerleave', reset);

    return () => {
      parent.removeEventListener('pointermove', handlePointerMove);
      parent.removeEventListener('pointerleave', reset);
    };
  }, [interactive, pointerX, pointerY, reduceMotion]);

  const borderColor =
  tone === 'light' ? 'rgba(148, 176, 255, 0.22)' : 'rgba(49, 85, 255, 0.16)';
  const accentColor =
  tone === 'light' ? 'rgba(124, 58, 237, 0.16)' : 'rgba(124, 58, 237, 0.1)';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}>
      
      <motion.div
        style={reduceMotion ? undefined : { x, y }}
        className="relative flex items-center justify-center">
        
        {Array.from({ length: rings }).map((_, index) => {
          const size = 260 + index * 180;
          const duration = 44 + index * 12;

          return (
            <motion.div
              key={`ring-${index}`}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `1px solid ${index % 2 === 0 ? borderColor : accentColor}`,
                boxShadow:
                index === 1 ?
                `0 0 120px -40px ${tone === 'light' ? 'rgba(49,85,255,0.55)' : 'rgba(49,85,255,0.28)'}` :
                undefined
              }}
              animate={
              reduceMotion ?
              undefined :
              {
                rotate: index % 2 === 0 ? 360 : -360,
                scale: [1, 1.035, 1]
              }
              }
              transition={{
                rotate: { duration, repeat: Infinity, ease: 'linear' },
                scale: {
                  duration: 14 + index * 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}>
              
              <span
                className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                  index % 2 === 0 ?
                  'rgba(56, 189, 248, 0.85)' :
                  'rgba(167, 139, 250, 0.8)',
                  boxShadow: '0 0 12px rgba(56,189,248,0.7)'
                }} />
              
            </motion.div>);

        })}
      </motion.div>
    </div>);

}