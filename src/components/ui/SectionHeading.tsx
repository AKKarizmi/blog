import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  action?: ReactNode;
  className?: string;
};

/**
 * Consistent section header: small eyebrow, large confident heading, quiet
 * supporting paragraph, optional inline action.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  action,
  className = ''
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col gap-8 ${
      isCenter ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between'} ${
      className}`}>
      
      <Reveal className={isCenter ? 'max-w-3xl' : 'max-w-2xl'}>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
          tone === 'dark' ?
          'border-white/15 bg-white/[0.04] text-slate-200' :
          'border-slate-200 bg-white text-foroz-blue'}`
          }>
          
          <span
            className={`h-1.5 w-1.5 rounded-full ${
            tone === 'dark' ? 'bg-foroz-light' : 'bg-foroz-blue'}`
            } />
          
          {eyebrow}
        </span>

        <h2
          className={`mt-6 font-heading section-title ${
          tone === 'dark' ? 'text-white' : 'text-foroz-ink'}`
          }>
          
          {title}
        </h2>

        {description &&
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
          tone === 'dark' ? 'text-slate-300/90' : 'text-slate-600'}`
          }>
          
            {description}
          </p>
        }
      </Reveal>

      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>);

}