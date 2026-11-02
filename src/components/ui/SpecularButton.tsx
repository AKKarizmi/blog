import type { ReactNode } from 'react';

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
  const classes = `group inline-flex max-w-full items-center justify-center gap-2 rounded-xl font-semibold leading-snug text-center transition-colors duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`;
  const content = <span className="inline-flex min-w-0 items-center justify-center gap-2 [&>svg]:shrink-0">{children}</span>;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel} className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={classes}>
      {content}
    </button>
  );
}
