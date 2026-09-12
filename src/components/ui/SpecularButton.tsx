import { useRef } from 'react';
import type { MouseEvent, ReactNode, RefObject } from 'react';

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

const base =
'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold tracking-[-0.01em] transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foroz-blue disabled:cursor-not-allowed disabled:opacity-60';

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base'
};

const variants: Record<Variant, string> = {
  primary:
  'text-white shadow-[0_14px_34px_-14px_rgba(49,85,255,0.75)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-16px_rgba(79,70,229,0.8)]',
  secondary:
  'border border-slate-200 bg-white/70 text-slate-800 backdrop-blur hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-soft',
  secondaryDark:
  'border border-white/15 bg-white/[0.04] text-white backdrop-blur hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]'
};

/**
 * Specular Button — primary CTAs carry a pointer-tracked specular highlight
 * and a soft lift. Secondary variants stay quiet on purpose.
 */
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
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  const isPrimary = variant === 'primary';

  const content =
  <>
      {isPrimary &&
    <span
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
        'linear-gradient(120deg, #3155FF 0%, #4F46E5 52%, #7C3AED 100%)'
      }} />

    }
      <span
      aria-hidden="true"
      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: isPrimary ?
        'radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.42), transparent 65%)' :
        'radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), rgba(49,85,255,0.14), transparent 68%)'
      }} />
    
      {isPrimary &&
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px bg-white/50" />

    }
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>;


  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
        onMouseMove={handleMove}>
        
        {content}
      </a>);

  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      onMouseMove={handleMove}>
      
      {content}
    </button>);

}