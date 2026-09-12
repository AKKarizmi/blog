import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Travel distance in pixels. */
  y?: number;
  /** Optional horizontal entrance. */
  x?: number;
  blur?: boolean;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
};

/**
 * Shared scroll-reveal wrapper so every section shares one motion language:
 * slow, soft, once, and fully disabled under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  x = 0,
  blur = true,
  className = '',
  as = 'div'
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const components = {
    div: motion.div,
    li: motion.li,
    section: motion.section,
    article: motion.article
  } as const;
  const Component = components[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, x, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      
      {children}
    </Component>);

}