import { getBooks } from "@/app/actions/books";
import React from "react";
import BooksClient from "./books-client";
import { getGenres } from "@/app/actions/genres";
import { getAuthors } from "@/app/actions/authors";
import { getTags } from "@/app/actions/tags";

interface BookSectionProps {
  sortBy?: string;
  order?: string;
  search?: string;
  authorSearch?: string;
  limit?: string;
  offset?: string;
}

export default async function BookSection({
  sortBy,
  order,
  search,
  authorSearch,
  limit,
  offset,
}: BookSectionProps) {
  const bookPage = await getBooks(sortBy, order, search, limit, offset);
  const authors = await getAuthors(authorSearch);
  const genres = await getGenres();
  const tags = await getTags();

  return (
    <BooksClient
      bookPage={bookPage}
      genres={genres}
      authors={authors}
      tags={tags}
    />
  );
}
