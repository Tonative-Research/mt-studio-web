import { forwardRef, TextareaHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: FieldError | string;
  hint?: string;
  /** Shows a character count if maxLength is set */
  showCount?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      required,
      error,
      hint,
      showCount,
      containerClassName,
      className,
      id,
      maxLength,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const hasError = Boolean(errorMessage);

    const currentLength =
      typeof value === 'string'
        ? value.length
        : typeof defaultValue === 'string'
          ? defaultValue.length
          : 0;

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

        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          className={cn(
            'input resize-y min-h-[96px]',
            hasError && 'input--error',
            className,
          )}
          {...props}
        />

        <div className="flex items-start justify-between mt-1.5 gap-2">
          <div>
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
          {showCount && maxLength && (
            <span
              className={cn(
                'text-[11px] tabular-nums shrink-0',
                currentLength >= maxLength ? 'text-red-500' : 'text-gray-400',
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
