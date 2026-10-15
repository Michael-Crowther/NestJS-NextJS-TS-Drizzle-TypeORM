import { getBookById, getBooks } from "@/app/actions/books";
import React from "react";
import BooksClient from "./books-client";
import { getGenres } from "@/app/actions/genres";
import { getAuthors } from "@/app/actions/authors";

interface BookSectionProps {
  sortBy?: string;
  order?: string;
  search?: string;
  authorSearch?: string;
}

export default async function BookSection({
  sortBy,
  order,
  search,
  authorSearch,
}: BookSectionProps) {
  const books = await getBooks(sortBy, order, search);
  const authors = await getAuthors(search);
  const genres = await getGenres();

  return (
    <BooksClient
      books={books}
      genres={genres}
      authors={authors}
      sortBy={sortBy}
      order={order}
    />
  );
}
