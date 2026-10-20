export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
};

export type Book = {
  id: string;
  title: string;
  author: Author;
  authorId: string;
  status: string; //Book Status
  rating: number | null;
  genreId: string | null;
  genre: Genre | null;
  tags?: Tag[];
  tagIds?: string[] | null;
  finishedAt: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BooksPage = {
  books: Book[];
  totalCount: number;
};

export type Genre = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Author = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};
