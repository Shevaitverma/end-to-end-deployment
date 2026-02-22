import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-900",
            "placeholder:text-slate-400",
            "transition-all duration-200",
            "focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10",
            "hover:border-slate-300",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
            "dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500",
            "dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20",
            "dark:hover:border-slate-600",
            error && "border-red-400 focus:border-red-400 focus:ring-red-500/10 dark:border-red-500/60",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500"
            role="alert"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
