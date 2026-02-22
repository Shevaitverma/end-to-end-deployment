import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-sm px-3 py-2.5 text-sm text-slate-700",
            "transition-all duration-200",
            "focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10",
            "hover:border-slate-300",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
            "dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-300",
            "dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20",
            "dark:hover:border-slate-600",
            error && "border-red-400 focus:border-red-400 focus:ring-red-500/10",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-xs font-medium text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };
