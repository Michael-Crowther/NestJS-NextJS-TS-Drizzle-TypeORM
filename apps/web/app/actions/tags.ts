"use server";
import z from "zod";
import { revalidatePath } from "next/cache";

const api_url = process.env.API_URL ?? "http://localhost:8085";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function createTag(formData: FormData) {
  const parsed = tagSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const res = await fetch(`${api_url}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    throw new Error("Could not create tag");
  }

  revalidatePath("/");
}

export async function getTags() {
  const res = await fetch(`${api_url}/tags`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Could not fetch tags");
  }

  return res.json();
}

export async function updateTag(id: string, formData: FormData) {
  const parsed = tagSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const res = await fetch(`${api_url}/tags/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    throw new Error("Issue updating Tag");
  }

  revalidatePath("/");
}

export async function deleteTag(id: string) {
  if (!id) {
    throw new Error("Id is required to delete tag");
  }

  const res = await fetch(`${api_url}/tags/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Error deleting tag");
  }

  revalidatePath("/");
}
