import { forwardRef, InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: FieldError | string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, containerClassName, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const hasError = Boolean(errorMessage);

    return (
      <div className={cn('flex flex-col gap-0.5', containerClassName)}>
        <label htmlFor={inputId} className="flex items-start gap-3 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            className={cn(
              // Base checkbox styles — @tailwindcss/forms provides the reset
              'mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 cursor-pointer',
              'text-primary-500',
              'focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0',
              'transition-colors duration-150',
              hasError && 'border-red-400',
              className,
            )}
            {...props}
          />
          <span className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {label}
            </span>
            {description && (
              <span className="text-xs text-gray-400 mt-0.5">{description}</span>
            )}
          </span>
        </label>

        {hasError && (
          <p id={`${inputId}-error`} role="alert" className="field-error ml-7">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
