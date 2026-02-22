interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white/40 backdrop-blur-sm px-8 py-20 text-center dark:border-slate-700/60 dark:bg-slate-800/30">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40">
        <svg
          className="h-10 w-10 text-indigo-400 dark:text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      {action}
    </div>
  );
}
