import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 ${hover ? "cursor-pointer" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
