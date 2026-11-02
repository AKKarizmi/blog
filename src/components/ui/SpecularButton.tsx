import { useReducedMotion } from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'secondaryDark';
type Size = 'md' | 'lg';

type SpecularButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  target?: string;
  rel?: string;
  className?: string;
  'aria-label'?: string;
};

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base'
};

const variants: Record<Variant, string> = {
  primary: 'button-primary border border-transparent bg-foroz-blue text-white hover:bg-foroz-hover active:bg-navy-800',
  secondary: 'border border-slate-300 bg-white text-foroz-blue hover:border-foroz-blue hover:bg-foroz-mist active:bg-foroz-mist',
  secondaryDark: 'border border-white/40 bg-transparent text-white hover:bg-white/10 active:bg-white/20'
};

/** Shared public-site actions. Props and link/button behavior are preserved. */
export function SpecularButton({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  disabled = false,
  target,
  rel,
  className = '',
  'aria-label': ariaLabel
}: SpecularButtonProps) {
  const reduceMotion = useReducedMotion();
  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion || disabled) return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };
  const classes = `group relative inline-flex max-w-full items-center justify-center gap-2 rounded-xl font-semibold leading-snug text-center transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`;
  const content = <>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
      style={{ background: variant === 'secondary'
        ? 'radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--brand-rgb) / 0.10), transparent 68%)'
        : 'radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.20), transparent 65%)' }}
    />
    <span className="relative inline-flex min-w-0 items-center justify-center gap-2 [&>svg]:shrink-0">{children}</span>
  </>;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel} className={classes} onClick={onClick} onMouseMove={handleMove}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={classes} onMouseMove={handleMove}>
      {content}
    </button>
  );
}
