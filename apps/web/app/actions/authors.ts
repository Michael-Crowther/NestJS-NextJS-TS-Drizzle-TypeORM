"use server";
const api_url = process.env.API_URL ?? "http://localhost:8085";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const authorSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
});

export async function createAuthor(formData: FormData) {
  const parsed = authorSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const res = await fetch(`${api_url}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  console.log("res", res);

  if (!res.ok) {
    throw new Error("Could not create author");
  }

  revalidatePath("/");
}

export async function getAuthors(authorSearch?: string) {
  const params = await new URLSearchParams();
  if (authorSearch) params.set("search", authorSearch);

  const res = await fetch(`${api_url}/authors?${params}`);

  if (!res.ok) {
    throw new Error("Could not fetch authors");
  }

  return res.json();
}

export async function updateAuthor(id: string, formData: FormData) {
  const parsed = authorSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const res = await fetch(`${api_url}/authors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    throw new Error("Issue updating Author");
  }

  revalidatePath("/");
}

export async function deleteAuthor(id: string) {
  if (!id) {
    throw new Error("Id is required to delete author");
  }

  const res = await fetch(`${api_url}/authors/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Error deleting author");
  }

  revalidatePath("/");
}
