"use server";
import { Todo } from "@/types";
import { revalidatePath } from "next/cache";

const api_url = process.env.API_URL ?? "http://localhost:8085";

export async function createTodo(formData: FormData) {
  const title = formData.get("title");
  if (!title) return;

  const res = await fetch(`${api_url}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("Failed to create todo item");

  revalidatePath("/");
}

export async function getTodos(
  sortBy?: string,
  order?: string,
): Promise<Todo[]> {
  const res = await fetch(`${api_url}/todos?sortBy=${sortBy}&order=${order}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to get Todo list");
  return res.json();
}

export async function completeTodo(id: string) {
  if (!id) throw new Error("Todo id is required");

  const res = await fetch(`${api_url}/todos`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error("Something went wrong completing Todo item");

  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  if (!id) throw new Error("ID is required to delete Todo");

  const res = await fetch(`${api_url}/todos`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error("Something went wrong deleting todo item");

  revalidatePath("/");
}
