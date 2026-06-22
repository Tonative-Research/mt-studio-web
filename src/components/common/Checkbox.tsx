import { forwardRef, InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: FieldError | string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, containerClassName, className, id, ...props }, ref) => {
    const inputId = id ?? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const hasError = Boolean(errorMessage);

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        <label htmlFor={inputId} className="flex items-start gap-3 cursor-pointer group w-fit">
          <span className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : undefined}
              className={cn(
                'h-4.5 w-4.5 rounded border-2 border-gray-300 bg-white cursor-pointer',
                'checked:bg-primary-500 checked:border-primary-500',
                'indeterminate:bg-primary-500 indeterminate:border-primary-500',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
                'transition-all duration-150',
                hasError && 'border-red-400',
                'appearance-none',
                // checkmark via background SVG
                "checked:bg-[url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E\")] checked:bg-no-repeat checked:bg-center",
                className,
              )}
              {...props}
            />
          </span>

          <span className="flex flex-col select-none">
            <span
              className={cn(
                'text-sm font-medium leading-snug transition-colors',
                hasError ? 'text-red-700' : 'text-gray-700 group-hover:text-gray-900',
              )}
            >
              {label}
            </span>
            {description && (
              <span className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</span>
            )}
          </span>
        </label>

        {hasError && (
          <p id={`${inputId}-error`} role="alert" className="field-error mt-1 ml-7">
            <AlertCircle size={12} className="shrink-0" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
