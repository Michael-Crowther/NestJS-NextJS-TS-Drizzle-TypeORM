"use server";
import TodosClient from "@/components/todos-client";
import { Todo } from "@/types/todo";
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

export async function getTodos(sortBy: string, order: string): Promise<Todo[]> {
  const res = await fetch(`${api_url}/todos`, {
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

export default async function Home() {
  const todos = await getTodos("createdAt", "asc");
  return <TodosClient todos={todos} />;
}
