"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as todosApi from "@/lib/api/todos";
import type { TodoListParams } from "@/lib/api/todos";
import { todoKeys } from "@/lib/api/query-keys";

/**
 * Interview-style list query.
 * Copy this file → use-books.ts and swap todosApi / todoKeys.
 */
export function useTodos(params: TodoListParams = {}) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todosApi.fetchTodos(params),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => todosApi.createTodo({ title }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

export function useCompleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todosApi.completeTodo(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todosApi.deleteTodo(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}
