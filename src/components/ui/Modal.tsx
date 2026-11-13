import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { lockScroll } from '../../utils/scrollLock';
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
  const location = useLocation();
  const previousLocation = useRef(location.key);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const release = lockScroll();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); closeRef.current(); }
      if (event.key === 'Tab') {
        const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]') || []).filter(node => node.getClientRects().length);
        const first = items[0]; const last = items[items.length - 1];
        if (!first) { event.preventDefault(); panelRef.current?.focus(); }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      release();
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => {
    if (previousLocation.current !== location.key) {
      previousLocation.current = location.key;
      closeRef.current();
    }
  }, [location.key]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto overscroll-contain bg-navy-900/70 p-0 backdrop-blur-md animate-fade-in sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}>
      
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="animate-scale-up relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-slate-200/80 bg-white shadow-soft focus:outline-none sm:rounded-2xl">
        
        <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-slate-100 bg-white/90 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            {eyebrow &&
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foroz-blue">
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
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
            
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
    </div>, document.body);

}