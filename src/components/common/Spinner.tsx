import { cn } from '@/utils/cn';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-6 h-6 border-[2.5px]',
};

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full border-current border-r-transparent animate-spin',
        sizeClasses[size],
        className,
      )}
    />
  );
}
