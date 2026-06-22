import { forwardRef, InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  containerClassName?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  required,
  error,
  orientation = 'vertical',
  containerClassName,
}: RadioGroupProps) {
  return (
    <fieldset className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <legend className={cn('label mb-2', required && 'label--required')}>
          {label}
        </legend>
      )}

      <div
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-3',
        )}
      >
        {options.map((opt) => (
          <RadioItem
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            hasError={Boolean(error)}
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="field-error mt-0.5">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

interface RadioItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  hasError?: boolean;
}

const RadioItem = forwardRef<HTMLInputElement, RadioItemProps>(
  ({ label, description, hasError, className, id, value, disabled, ...props }, ref) => {
    const inputId = id ?? `radio-${value}`;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group select-none',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            value={value}
            disabled={disabled}
            className={cn(
              'h-4.5 w-4.5 cursor-pointer border-2 border-gray-300 bg-white',
              'checked:border-primary-500 checked:bg-primary-500',
              'appearance-none rounded-full',
              // inner dot via box-shadow on checked
              'checked:shadow-[inset_0_0_0_3px_white]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
              'transition-all duration-150',
              hasError && 'border-red-400',
              disabled && 'cursor-not-allowed',
              className,
            )}
            {...props}
          />
        </span>

        <span className="flex flex-col">
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
    );
  },
);

RadioItem.displayName = 'RadioItem';
