"use client";

import type { Todo } from "@/types/todo";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="animate-fade-in-up rounded-2xl bg-white/70 backdrop-blur-sm p-5 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-800/70 dark:ring-slate-700/60"
      role="region"
      aria-label="Todo statistics"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{total}</p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Total</p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{active}</p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Active</p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completed}</p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Done</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{progress}%</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
