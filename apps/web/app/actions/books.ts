"use server";

import { Book } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const api_url = process.env.API_URL ?? "http://localhost:8085";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["to_read", "reading", "finished"], {
    message: "Invalid status",
  }),
  rating: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number().min(1).max(5).optional(),
  ),
  genreId: z.preprocess((v) => (v === "" ? undefined : v), z.uuid().optional()),
  authorId: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.uuid().optional(),
  ),
});

export async function createBook(formData: FormData) {
  const parsed = bookSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // console.log("parsed", parsed.data);

  const res = await fetch(`${api_url}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  // console.log("res", res);

  if (!res.ok) {
    throw new Error("Failed to create book");
  }

  revalidatePath("/");
}

// get all books
export async function getBooks(
  sortBy?: string,
  order?: string,
  search?: string,
): Promise<Book[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const res = await fetch(`${api_url}/books?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

// get book by id
export async function getBookById(id: string): Promise<Book> {
  const res = await fetch(`${api_url}/books/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch book with id ${id}`);
  }

  return res.json();
}

// update book
export async function updateBook(id: string, formData: FormData) {
  const parsed = bookSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const res = await fetch(`${api_url}/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update book with id ${id}`);
  }

  revalidatePath("/");
}

// delete book
export async function deleteBook(id: string) {
  if (!id) throw new Error("id is required to delete book");

  const res = await fetch(`${api_url}/books`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete book");
  }

  revalidatePath("/");
}
