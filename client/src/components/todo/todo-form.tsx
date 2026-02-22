"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CreateTodoInput, Priority, Todo, UpdateTodoInput } from "@/types/todo";

interface TodoFormProps {
  mode?: "create" | "edit";
  initialData?: Todo;
  onSubmit: (data: CreateTodoInput | UpdateTodoInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TodoForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState<Priority>(
    initialData?.priority || "medium"
  );
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    if (mode === "create") {
      const data: CreateTodoInput = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        priority,
      };
      onSubmit(data);
      setTitle("");
      setDescription("");
      setPriority("medium");
    } else {
      const data: UpdateTodoInput = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        priority,
      };
      onSubmit(data);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-slide-down space-y-4 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 dark:bg-slate-800/80 dark:shadow-slate-900/50 dark:ring-slate-700/60"
      aria-label={mode === "create" ? "Add new todo" : "Edit todo"}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
          {mode === "create" ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
          )}
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {mode === "create" ? "Add New Todo" : "Edit Todo"}
        </h2>
      </div>

      <Input
        label="Title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        autoFocus={mode === "create"}
      />

      <Input
        label="Description"
        placeholder="Add a description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Select
        label="Priority"
        options={priorityOptions}
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === "create"
              ? "Adding..."
              : "Saving..."
            : mode === "create"
              ? "Add Todo"
              : "Save Changes"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
