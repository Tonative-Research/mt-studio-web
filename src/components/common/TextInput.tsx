import { forwardRef, InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text shown above the input */
  label?: string;
  /** Whether the field is required — appends a red asterisk to the label */
  required?: boolean;
  /** RHF FieldError object or a plain error string */
  error?: FieldError | string;
  /** Hint text shown below the input when there is no error */
  hint?: string;
  /** Icon or element rendered on the left inside the input */
  leadingAddon?: React.ReactNode;
  /** Icon or element rendered on the right inside the input */
  trailingAddon?: React.ReactNode;
  /** Wraps the entire field including label and error */
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
          <label
            htmlFor={inputId}
            className={cn('label', required && 'label--required')}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingAddon && (
            <span className="absolute left-3 flex items-center text-gray-400 pointer-events-none">
              {leadingAddon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            className={cn(
              'input',
              hasError && 'input--error',
              leadingAddon && 'pl-9',
              trailingAddon && 'pr-9',
              className,
            )}
            {...props}
          />

          {trailingAddon && (
            <span className="absolute right-3 flex items-center text-gray-400 pointer-events-none">
              {trailingAddon}
            </span>
          )}
        </div>

        {hasError && (
          <p id={`${inputId}-error`} role="alert" className="field-error">
            <AlertCircle size={12} />
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
