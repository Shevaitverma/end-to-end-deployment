import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/todo";

type BadgeVariant = "default" | "low" | "medium" | "high";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  priority?: Priority;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-600 ring-slate-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  medium: "bg-amber-50 text-amber-700 ring-amber-200/60",
  high: "bg-rose-50 text-rose-700 ring-rose-200/60",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-rose-500",
};

function Badge({ className, variant, priority, children, ...props }: BadgeProps) {
  const resolvedVariant = priority || variant || "default";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        variantStyles[resolvedVariant],
        className
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[resolvedVariant])} />
      {children || priority}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
