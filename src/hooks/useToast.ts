import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return React.createElement(
    ToastContext.Provider,
    { value: { toasts, toast, dismiss } },
    children,
    React.createElement(
      'div',
      { className: 'fixed bottom-4 right-4 z-50 flex flex-col gap-2' },
      toasts.map((t) =>
        React.createElement(
          'div',
          {
            key: t.id,
            className: `flex min-w-[300px] max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg transition-all ${
              t.variant === 'destructive'
                ? 'border-red-200 bg-red-50 text-red-900'
                : t.variant === 'success'
                ? 'border-green-200 bg-green-50 text-green-900'
                : 'border-gray-200 bg-white text-gray-900'
            }`,
          },
          React.createElement(
            'div',
            { className: 'flex-1' },
            t.title && React.createElement('h4', { className: 'font-medium' }, t.title),
            React.createElement('p', { className: 'text-sm opacity-90' }, t.description)
          ),
          React.createElement(
            'button',
            {
              onClick: () => dismiss(t.id),
              className: 'rounded-sm opacity-70 hover:opacity-100',
            },
            React.createElement(
              'svg',
              { className: 'h-4 w-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
              React.createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M6 18L18 6M6 6l12 12',
              })
            )
          )
        )
      )
    )
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
