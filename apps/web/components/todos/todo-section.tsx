import { getTodos } from "@/app/actions/todos";
import React from "react";
import TodosClient from "./todos-client";

interface TodoSectionProps {
  sortBy?: string;
  order?: string;
}

export default async function TodoSection({ sortBy, order }: TodoSectionProps) {
  const todos = await getTodos(sortBy, order);

  return <TodosClient todos={todos} sortBy={sortBy} order={order} />;
}
