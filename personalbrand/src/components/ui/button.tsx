import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
  outline:
    "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
