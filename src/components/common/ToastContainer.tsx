import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeToast, type ToastVariant } from '@/redux/toastSlice';
import { cn } from '@/utils/cn';

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
  warning: <AlertTriangle size={16} />,
};

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-white border-green-200 text-green-700',
  error:   'bg-white border-red-200   text-red-700',
  info:    'bg-white border-primary-200 text-primary-700',
  warning: 'bg-white border-amber-200 text-amber-700',
};

const iconClasses: Record<ToastVariant, string> = {
  success: 'text-green-500',
  error:   'text-red-500',
  info:    'text-primary-500',
  warning: 'text-amber-500',
};

interface ToastItemProps {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

function ToastItem({ id, message, variant, duration = 4000 }: ToastItemProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(() => dispatch(removeToast(id)), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-full max-w-sm px-4 py-3',
        'rounded-xl border shadow-lg shadow-black/5',
        variantClasses[variant],
      )}
    >
      <span className={cn('mt-0.5 shrink-0', iconClasses[variant])}>
        {icons[variant]}
      </span>

      <p className="flex-1 text-sm font-medium text-gray-800 leading-snug">
        {message}
      </p>

      <button
        onClick={() => dispatch(removeToast(id))}
        aria-label="Dismiss notification"
        className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

/**
 * Render this once at the root level (e.g. inside AppProvider or App.tsx).
 * It reads toasts from Redux and renders them in a fixed bottom-right stack.
 */
export function ToastContainer() {
  const toasts = useAppSelector((state) => state.toast.toasts);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
            <ToastItem {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
