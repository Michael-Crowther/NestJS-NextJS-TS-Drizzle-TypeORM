"use server";

import { revalidatePath } from "next/cache";
import * as todosApi from "@/lib/api/todos";
import type { TodoListParams } from "@/lib/api/todos";

/**
 * Optional Next server-action wrappers over the same lib/api client.
 * React Query hooks call lib/api directly from the browser instead.
 */
export async function createTodo(formData: FormData) {
  const title = formData.get("title");
  if (!title || typeof title !== "string") return;

  await todosApi.createTodo({ title });
  revalidatePath("/");
}

export async function getTodos(params: TodoListParams = {}) {
  return todosApi.fetchTodos(params);
}

export async function completeTodo(id: string) {
  if (!id) throw new Error("Todo id is required");
  await todosApi.completeTodo(id);
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  if (!id) throw new Error("ID is required to delete Todo");
  await todosApi.deleteTodo(id);
  revalidatePath("/");
}
