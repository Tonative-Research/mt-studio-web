import { cn } from '@/utils/cn';

type SkeletonVariant = 'line' | 'circle' | 'card' | 'button';

interface SkeletonProps {
  variant?: SkeletonVariant;
  /** For 'line' - controls width (e.g. 'w-1/2', 'w-full') */
  width?: string;
  /** For 'line' - controls height (e.g. 'h-4') */
  height?: string;
  /** Number of line repetitions */
  lines?: number;
  className?: string;
}

const base = 'animate-pulse bg-gray-200 rounded';

export function Skeleton({
  variant = 'line',
  width = 'w-full',
  height = 'h-4',
  lines = 1,
  className,
}: SkeletonProps) {
  if (variant === "circle") {
    return (
      <span
        aria-hidden="true"
        className={cn(base, "rounded-full", width, height, className)}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        aria-hidden="true"
        className={cn(base, "rounded-xl w-full h-36", className)}
      />
    );
  }

  if (variant === "button") {
    return (
      <span
        aria-hidden="true"
        className={cn(base, "rounded-lg h-10 w-28 inline-block", className)}
      />
    );
  }

  // 'line' - supports multiple lines with the last one narrower for realism
  if (lines > 1) {
    return (
      <div aria-hidden="true" className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={cn(base, height, i === lines - 1 ? "w-3/4" : width)}
          />
        ))}
      </div>
    );
  }

  return (
    <span aria-hidden="true" className={cn(base, height, width, className)} />
  );
}
