import { forwardRef, SelectHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: FieldError | string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      required,
      error,
      hint,
      options,
      placeholder,
      containerClassName,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const hasError = Boolean(errorMessage);

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className={cn('label', required && 'label--required')}>
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              'input appearance-none pr-10 cursor-pointer',
              hasError && 'input--error',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown size={16} className="text-gray-400" aria-hidden="true" />
          </span>
        </div>

        {hasError && (
          <p id={`${inputId}-error`} role="alert" className="field-error">
            <AlertCircle size={12} className="shrink-0" />
            {errorMessage}
          </p>
        )}
        {!hasError && hint && (
          <p id={`${inputId}-hint`} className="field-hint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
