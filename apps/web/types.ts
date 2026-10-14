export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  status: string; //Book Status
  rating: number | null;
  genreId: string | null;
  genre: Genre | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Genre = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
