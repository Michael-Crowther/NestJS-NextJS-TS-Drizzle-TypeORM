import type { Todo } from "@/types";
import { api } from "./client";

export type TodoListParams = {
  sortBy?: string;
  order?: string;
};

/** GET /todos */
export function fetchTodos(params: TodoListParams = {}) {
  const qs = new URLSearchParams();
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.order) qs.set("order", params.order);
  const query = qs.toString();

  return api<Todo[]>(`/todos${query ? `?${query}` : ""}`);
}

/** POST /todos */
export function createTodo(body: { title: string; completed?: boolean }) {
  return api<{ message: string }>("/todos", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PUT /todos — mark complete */
export function completeTodo(id: string) {
  return api<{ message: string }>("/todos", {
    method: "PUT",
    body: JSON.stringify({ id }),
  });
}

/** DELETE /todos */
export function deleteTodo(id: string) {
  return api<{ message: string }>("/todos", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}
