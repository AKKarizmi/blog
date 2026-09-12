import { useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Shared detail modal used by announcements, events, collaborations, team bios
 * and the About story — same behaviour as before, restyled.
 */
export function Modal({ open, onClose, title, eyebrow, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-navy-900/70 p-0 backdrop-blur-md animate-fade-in sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}>
      
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="animate-scale-up relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-slate-200/80 bg-white shadow-[0_40px_120px_-40px_rgba(8,13,28,0.6)] focus:outline-none sm:rounded-3xl">
        
        <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-slate-100 bg-white/90 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            {eyebrow &&
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foroz-indigo">
                {eyebrow}
              </p>
            }
            <h3 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
            
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>

        {footer &&
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8">
            {footer}
          </div>
        }
      </div>
    </div>);

}