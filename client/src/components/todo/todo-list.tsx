"use client";

import { useState, useCallback } from "react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "@/hooks/use-todos";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { TodoFilters } from "./todo-filters";
import { TodoStats } from "./todo-stats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type {
  TodoFilters as TodoFiltersType,
  CreateTodoInput,
  UpdateTodoInput,
} from "@/types/todo";

const DEFAULT_FILTERS: TodoFiltersType = {
  status: "all",
  priority: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export function TodoList() {
  const [filters, setFilters] = useState<TodoFiltersType>(DEFAULT_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: response, isLoading, isError, error } = useTodos(filters);
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const todos = response?.data || [];
  const pagination = response?.pagination;

  const handleFilterChange = useCallback(
    (newFilters: Partial<TodoFiltersType>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  function handleCreate(data: CreateTodoInput | UpdateTodoInput) {
    setErrorMessage(null);
    createTodo.mutate(data as CreateTodoInput, {
      onSuccess: () => {
        setShowForm(false);
      },
      onError: (err) => {
        setErrorMessage(err.message || "Failed to create todo");
      },
    });
  }

  function handleToggle(id: string, completed: boolean) {
    setErrorMessage(null);
    updateTodo.mutate(
      { id, input: { completed } },
      {
        onError: (err) => {
          setErrorMessage(err.message || "Failed to update todo");
        },
      }
    );
  }

  function handleUpdate(id: string, input: UpdateTodoInput) {
    setErrorMessage(null);
    updateTodo.mutate(
      { id, input },
      {
        onError: (err) => {
          setErrorMessage(err.message || "Failed to update todo");
        },
      }
    );
  }

  function handleDelete(id: string) {
    setErrorMessage(null);
    deleteTodo.mutate(id, {
      onError: (err) => {
        setErrorMessage(err.message || "Failed to delete todo");
      },
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      {/* Header */}
      <div className="animate-fade-in-up text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3.5 shadow-lg shadow-indigo-500/30">
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Todo App
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Stay organized. Get things done.
        </p>
      </div>

      {/* Add button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          aria-controls="todo-form"
          size="lg"
          className="rounded-full px-8"
        >
          {showForm ? (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Todo
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          className="animate-slide-down rounded-2xl border border-red-200/80 bg-red-50/80 backdrop-blur-sm px-5 py-4 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-400"
          role="alert"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40"
              aria-label="Dismiss error"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {todos.length > 0 && <TodoStats todos={todos} />}

      {/* Create Form */}
      {showForm && (
        <div id="todo-form">
          <TodoForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createTodo.isPending}
          />
        </div>
      )}

      {/* Filters */}
      <TodoFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Content */}
      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : isError ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-6 py-12 text-center dark:border-red-800/60 dark:bg-red-950/30"
          role="alert"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="font-semibold text-red-800 dark:text-red-400">Failed to load todos</p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {error?.message || "An unexpected error occurred"}
          </p>
        </div>
      ) : todos.length === 0 ? (
        <EmptyState
          title="No todos yet"
          description="Get started by creating your first todo. Stay organized and productive!"
          action={
            !showForm ? (
              <Button onClick={() => setShowForm(true)} size="lg" className="rounded-full px-8">
                Create Your First Todo
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Todo List */}
          <div className="space-y-3" role="list" aria-label="Todo list">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                role="listitem"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={handleToggle}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  isUpdating={
                    updateTodo.isPending &&
                    updateTodo.variables?.id === todo.id
                  }
                  isDeleting={
                    deleteTodo.isPending &&
                    deleteTodo.variables === todo.id
                  }
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className="flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur-sm px-5 py-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-800/70 dark:ring-slate-700/60"
              role="navigation"
              aria-label="Pagination"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.page}</span> of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.totalPages}</span>
                {" "}
                <span className="text-slate-400 dark:text-slate-500">({pagination.total} total)</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleFilterChange({ page: filters.page - 1 })
                  }
                  disabled={filters.page <= 1}
                  aria-label="Previous page"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleFilterChange({ page: filters.page + 1 })
                  }
                  disabled={filters.page >= pagination.totalPages}
                  aria-label="Next page"
                >
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
