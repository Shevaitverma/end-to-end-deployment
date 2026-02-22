import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600",
            sizeStyles[size],
            className
          )}
        />
        <div
          className={cn(
            "absolute inset-0 animate-spin rounded-full border-2 border-transparent border-b-purple-400 opacity-50",
            sizeStyles[size],
          )}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
