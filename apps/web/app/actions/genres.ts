"use server";

import { Genre } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const api_url = process.env.API_URL ?? "http://localhost:8085";

const genreSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// get all genres
export async function getGenres() {
  const res = await fetch(`${api_url}/genres`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  console.log("res", res);

  if (!res.ok) {
    throw new Error("Failed to fetch genres");
  }

  const genres = await res.json();
  return genres;
}

//create genre
export async function createGenre(formData: FormData) {
  const parsed = genreSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  //check unique constraint
  const genres = await getGenres();
  const genreExists = genres.some(
    (genre: Genre) => genre.name === parsed.data.name,
  );

  if (genreExists) {
    throw new Error("Genre already exists");
  }

  const res = await fetch(`${api_url}/genres`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    throw new Error("Failed to create genre");
  }

  revalidatePath("/");
}
