// export default async function Home({
//   searchParams,
// }: {
//   searchParams: Promise<{ sortBy?: string; order?: string }>;
// }) {
//   const params = await searchParams;
//   const sortBy = params.sortBy ?? "createdAt";
//   const order = params.order ?? "asc";
//   const todos = await getTodos(sortBy, order);
//   return <TodosClient todos={todos} sortBy={sortBy} order={order} />;
// }

import { Suspense } from "react";
import TodoSection from "../components/todos/todo-section";
import BookSection from "../components/books/book-section";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    todoSortBy?: string;
    todoOrder?: string;
    sortBy?: string;
    order?: string;
    search?: string;
    authorSearch?: string;
    limit?: string;
    offset?: string;
  }>;
}) {
  const params = await searchParams;

  const todoSortBy = params.todoSortBy ?? "createdAt";
  const todoOrder = params.todoOrder ?? "asc";

  const sortBy = params.sortBy ?? "createdAt";
  const order = params.order ?? "asc";

  const limit = params.limit ?? "10";
  const offset = params.offset ?? "0";

  return (
    <main className="mx-auto max-w-6xl flex flex-col gap-16 p-20">
      <Suspense fallback={<p>Loading todos...</p>}>
        <TodoSection sortBy={todoSortBy} order={todoOrder} />
      </Suspense>

      <Suspense fallback={<p>Loading books...</p>}>
        <BookSection
          sortBy={sortBy}
          order={order}
          search={params.search}
          authorSearch={params.authorSearch}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </main>
  );
}
