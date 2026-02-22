"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TodoForm } from "./todo-form";
import type { Todo, UpdateTodoInput } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, input: UpdateTodoInput) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleToggle() {
    onToggle(todo.id, !todo.completed);
  }

  function handleUpdate(input: UpdateTodoInput) {
    onUpdate(todo.id, input);
    setIsEditing(false);
  }

  function handleDelete() {
    onDelete(todo.id);
    setShowDeleteConfirm(false);
  }

  if (isEditing) {
    return (
      <TodoForm
        mode="edit"
        initialData={todo}
        onSubmit={(data) => handleUpdate(data as UpdateTodoInput)}
        onCancel={() => setIsEditing(false)}
        isLoading={isUpdating}
      />
    );
  }

  return (
    <div
      className={cn(
        "animate-fade-in-up group relative rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-sm ring-1 ring-slate-200/60",
        "transition-all duration-300 ease-out",
        "hover:shadow-md hover:ring-slate-300/60 hover:-translate-y-0.5",
        "dark:bg-slate-800/80 dark:ring-slate-700/60 dark:hover:ring-slate-600/60",
        todo.completed && "bg-slate-50/80 ring-slate-100 dark:bg-slate-800/40 dark:ring-slate-700/40",
        (isUpdating || isDeleting) && "pointer-events-none opacity-50"
      )}
      role="article"
      aria-label={`Todo: ${todo.title}`}
    >
      {/* Priority accent bar */}
      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-1 rounded-full transition-colors",
          todo.priority === "high" && "bg-rose-400",
          todo.priority === "medium" && "bg-amber-400",
          todo.priority === "low" && "bg-emerald-400",
          todo.completed && "opacity-30"
        )}
      />

      <div className="flex items-start gap-4 pl-3">
        {/* Checkbox */}
        <div className="flex pt-0.5">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className={cn(
              "h-5 w-5 cursor-pointer rounded-md border-2 border-slate-300 text-indigo-600",
              "transition-all duration-200",
              "focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
              "checked:border-indigo-500 checked:bg-indigo-500",
              "dark:border-slate-600",
              todo.completed && "border-emerald-400 bg-emerald-500 checked:border-emerald-500 checked:bg-emerald-500"
            )}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3
              className={cn(
                "text-sm font-semibold text-slate-800 transition-all duration-300 dark:text-slate-200",
                todo.completed && "text-slate-400 line-through dark:text-slate-500"
              )}
            >
              {todo.title}
            </h3>
            <Badge priority={todo.priority} />
          </div>

          {todo.description && (
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed text-slate-500 transition-colors dark:text-slate-400",
                todo.completed && "text-slate-300 dark:text-slate-600"
              )}
            >
              {todo.description}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Created {formatDate(todo.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit "${todo.title}"`}
            className="rounded-xl"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Button>

          {showDeleteConfirm ? (
            <div className="animate-slide-down flex items-center gap-1">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                aria-label={`Confirm delete "${todo.title}"`}
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                aria-label="Cancel delete"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label={`Delete "${todo.title}"`}
              className="rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
