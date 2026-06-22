import { cn } from '@/utils/cn';

type BadgeVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  info:    'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error:   'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-600',
};

const dotColours: Record<BadgeVariant, string> = {
  info:    'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
  neutral: 'bg-gray-400',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColours[variant])}
        />
      )}
      {children}
    </span>
  );
}
