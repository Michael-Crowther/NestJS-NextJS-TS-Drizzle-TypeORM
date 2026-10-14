import { getBookById, getBooks } from "@/app/actions/books";
import React from "react";
import BooksClient from "./books-client";
import { getGenres } from "@/app/actions/genres";

interface BookSectionProps {
  sortBy?: string;
  order?: string;
}

export default async function BookSection({ sortBy, order }: BookSectionProps) {
  const books = await getBooks(sortBy, order);
  const genres = await getGenres();

  console.log("genres", genres);

  return (
    <BooksClient books={books} genres={genres} sortBy={sortBy} order={order} />
  );
}
