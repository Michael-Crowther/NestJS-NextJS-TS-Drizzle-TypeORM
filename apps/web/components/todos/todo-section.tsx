import React from "react";
import TodosClient from "./todos-client";

interface TodoSectionProps {
  sortBy?: string;
  order?: string;
}

/** Server shell — client fetches via React Query (see hooks/use-todos.ts). */
export default function TodoSection({ sortBy, order }: TodoSectionProps) {
  return <TodosClient sortBy={sortBy} order={order} />;
}
