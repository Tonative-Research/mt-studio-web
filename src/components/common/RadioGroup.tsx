import { forwardRef, InputHTMLAttributes } from 'react';
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
    <fieldset className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <legend className={cn('label mb-1', required && 'label--required')}>
          {label}
        </legend>
      )}

      <div
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        )}
        role="radiogroup"
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
        <p role="alert" className="field-error">
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
  ({ label, description, hasError, className, id, value, ...props }, ref) => {
    const inputId = id ?? `radio-${value}`;

    return (
      <label
        htmlFor={inputId}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <input
          ref={ref}
          type="radio"
          id={inputId}
          value={value}
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 border-gray-300 cursor-pointer',
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
    );
  },
);

RadioItem.displayName = 'RadioItem';
