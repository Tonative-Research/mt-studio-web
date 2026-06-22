import { forwardRef, InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: FieldError | string;
  hint?: string;
  leadingAddon?: React.ReactNode;
  trailingAddon?: React.ReactNode;
  containerClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      required,
      error,
      hint,
      leadingAddon,
      trailingAddon,
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

        <div className="relative flex items-center">
          {leadingAddon && (
            <span className="absolute left-3.5 flex items-center text-gray-400 pointer-events-none z-10">
              {leadingAddon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              'input',
              hasError && 'input--error',
              leadingAddon && 'pl-10',
              trailingAddon && 'pr-10',
              className,
            )}
            {...props}
          />

          {trailingAddon && (
            <span className="absolute right-3.5 flex items-center text-gray-400 z-10">
              {trailingAddon}
            </span>
          )}
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

TextInput.displayName = 'TextInput';
