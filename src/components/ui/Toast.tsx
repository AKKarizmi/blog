import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '../../hooks/useToast';
interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) =>
        <motion.div
          key={toast.id}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2
            }
          }}
          className="pointer-events-auto flex items-center gap-3 bg-white rounded-lg shadow-lg border border-gray-100 p-4 min-w-[300px]">
          
            {toast.type === 'success' &&
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          }
            {toast.type === 'error' &&
          <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          }
            {toast.type === 'info' &&
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          }

            <p className="text-sm font-medium text-gray-800 flex-1">
              {toast.message}
            </p>

            <button
            onClick={() => onRemove(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}