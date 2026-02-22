"use client";

import { Select } from "@/components/ui/select";
import type { TodoFilters as TodoFiltersType } from "@/types/todo";

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFilterChange: (filters: Partial<TodoFiltersType>) => void;
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const sortByOptions = [
  { value: "createdAt", label: "Date Created" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

const sortOrderOptions = [
  { value: "desc", label: "Newest first" },
  { value: "asc", label: "Oldest first" },
];

export function TodoFilters({ filters, onFilterChange }: TodoFiltersProps) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl bg-white/70 backdrop-blur-sm p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-800/70 dark:ring-slate-700/60"
      role="group"
      aria-label="Filter and sort options"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value as TodoFiltersType["status"],
              page: 1,
            })
          }
          aria-label="Filter by status"
        />
        <Select
          label="Priority"
          options={priorityOptions}
          value={filters.priority}
          onChange={(e) =>
            onFilterChange({
              priority: e.target.value as TodoFiltersType["priority"],
              page: 1,
            })
          }
          aria-label="Filter by priority"
        />
        <Select
          label="Sort By"
          options={sortByOptions}
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              sortBy: e.target.value as TodoFiltersType["sortBy"],
            })
          }
          aria-label="Sort by field"
        />
        <Select
          label="Order"
          options={sortOrderOptions}
          value={filters.sortOrder}
          onChange={(e) =>
            onFilterChange({
              sortOrder: e.target.value as TodoFiltersType["sortOrder"],
            })
          }
          aria-label="Sort order"
        />
      </div>
    </div>
  );
}
