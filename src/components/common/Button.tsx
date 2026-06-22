import { forwardRef, ButtonHTMLAttributes } from "react";
import { Spinner } from "@/components/common/Spinner";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Icon placed before the label */
  leadingIcon?: React.ReactNode;
  /** Icon placed after the label */
  trailingIcon?: React.ReactNode;
  /** Stretches button to full width of its container */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary-500 text-white",
    "hover:bg-primary-600 active:bg-primary-700",
    "focus-visible:outline-primary-500",
    "disabled:bg-primary-300",
  ].join(" "),
  secondary: [
    "bg-gray-200 text-gray-700 border border-gray-300",
    "hover:bg-gray-50 active:bg-gray-100",
    "focus-visible:outline-primary-500",
    "disabled:text-gray-400 disabled:border-gray-200",
  ].join(" "),
  accent: [
    "bg-accent-500 text-primary-900 font-semibold",
    "hover:bg-accent-400 active:bg-accent-600",
    "focus-visible:outline-accent-500",
    "disabled:bg-accent-200",
  ].join(" "),
  ghost: [
    "bg-transparent text-gray-600",
    "hover:bg-gray-100 active:bg-gray-200",
    "focus-visible:outline-primary-500",
    "disabled:text-gray-300",
  ].join(" "),
  danger: [
    "bg-red-600 text-white",
    "hover:bg-red-700 active:bg-red-800",
    "focus-visible:outline-red-600",
    "disabled:bg-red-300",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const spinnerSizeMap: Record<ButtonSize, "xs" | "sm" | "md"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center rounded-lg font-medium",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:opacity-60",
          // Variant
          variantClasses[variant],
          // Size
          sizeClasses[size],
          // Full width
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner size={spinnerSizeMap[size]} className="opacity-80" />
        ) : (
          leadingIcon
        )}
        {children && <span>{children}</span>}
        {!loading && trailingIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
