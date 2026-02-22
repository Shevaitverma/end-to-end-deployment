import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.97] focus-visible:ring-indigo-500",
  secondary:
    "bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/80 shadow-sm hover:bg-white hover:border-slate-300 hover:shadow active:scale-[0.97] focus-visible:ring-slate-400 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/80 dark:hover:bg-slate-700/80 dark:hover:border-slate-600",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/25 hover:from-red-600 hover:to-rose-700 active:scale-[0.97] focus-visible:ring-red-500",
  ghost:
    "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 active:scale-[0.97] focus-visible:ring-slate-400 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/80",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
