"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { todoApi } from "@/lib/api";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
  ApiResponse,
} from "@/types/todo";

const TODOS_QUERY_KEY = "todos";

export function useTodos(filters: TodoFilters) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, filters],
    queryFn: () => todoApi.getAll(filters),
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, id],
    queryFn: () => todoApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.create(input),
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueriesData<ApiResponse<Todo[]>>({
        queryKey: [TODOS_QUERY_KEY],
      });

      // Optimistically update the cache
      queryClient.setQueriesData<ApiResponse<Todo[]>>(
        { queryKey: [TODOS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          const optimisticTodo: Todo = {
            id: `temp-${Date.now()}`,
            title: newTodo.title,
            description: newTodo.description,
            completed: false,
            priority: newTodo.priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            ...old,
            data: [optimisticTodo, ...old.data],
          };
        }
      );

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todoApi.update(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });

      const previousTodos = queryClient.getQueriesData<ApiResponse<Todo[]>>({
        queryKey: [TODOS_QUERY_KEY],
      });

      // Optimistically update the todo in all cached queries
      queryClient.setQueriesData<ApiResponse<Todo[]>>(
        { queryKey: [TODOS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((todo) =>
              todo.id === id
                ? { ...todo, ...input, updatedAt: new Date().toISOString() }
                : todo
            ),
          };
        }
      );

      return { previousTodos };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });

      const previousTodos = queryClient.getQueriesData<ApiResponse<Todo[]>>({
        queryKey: [TODOS_QUERY_KEY],
      });

      // Optimistically remove the todo from all cached queries
      queryClient.setQueriesData<ApiResponse<Todo[]>>(
        { queryKey: [TODOS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((todo) => todo.id !== deletedId),
          };
        }
      );

      return { previousTodos };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}
