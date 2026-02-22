export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: Priority;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  completed?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type FilterStatus = "all" | "active" | "completed";
export type SortField = "createdAt" | "priority" | "title";
export type SortOrder = "asc" | "desc";

export interface TodoFilters {
  status: FilterStatus;
  priority: Priority | "all";
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}
