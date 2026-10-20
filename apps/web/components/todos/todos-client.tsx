"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import moment from "moment";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCompleteTodo,
  useCreateTodo,
  useDeleteTodo,
  useTodos,
} from "@/hooks/use-todos";

type TodosClientProps = {
  sortBy?: string;
  order?: string;
};

type SortByOptions = "createdAt" | "completedAt";

/**
 * SPA-style todos UI: data via useQuery / useMutation (not server actions).
 * Yoink this + hooks/use-todos.ts + lib/api/todos.ts for books/etc.
 */
export default function TodosClient({
  sortBy = "createdAt",
  order = "asc",
}: TodosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");

  const { data: todos = [], isLoading, error } = useTodos({ sortBy, order });
  const createTodo = useCreateTodo();
  const completeTodo = useCompleteTodo();
  const deleteTodo = useDeleteTodo();

  function updateSort(nextSortBy: SortByOptions) {
    const currentSort = searchParams.get("todoSortBy") ?? "createdAt";
    const currentOrder = searchParams.get("todoOrder") ?? "asc";

    let nextOrder: "asc" | "desc" = "asc";
    if (currentSort === nextSortBy) {
      nextOrder = currentOrder === "asc" ? "desc" : "asc";
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("todoSortBy", nextSortBy);
    params.set("todoOrder", nextOrder);
    router.replace(`/?${params.toString()}`);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    createTodo.mutate(trimmed, {
      onSuccess: () => setTitle(""),
    });
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Loading todos...</p>;
  }

  if (error) {
    return (
      <p className="text-destructive">
        Failed to load todos. Is the API running on :8085?
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <form onSubmit={handleCreate} className="flex gap-2 w-full">
        <Input
          placeholder="What do you need to do?"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          required
        />
        <Button type="submit" disabled={createTodo.isPending}>
          Submit
        </Button>
      </form>

      <Table className="my-10 mx-auto">
        <TableCaption>A list of your to-do items (via useQuery)</TableCaption>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-1/2">Title</TableHead>
            <TableHead className="w-1/4 hover:cursor-pointer hover:bg-accent">
              <div
                className="flex justify-between items-center"
                onClick={() => updateSort("createdAt")}
              >
                <span>Created</span>
                {sortBy === "createdAt" && order === "asc" ? (
                  <ArrowUp className="h-3 w-3 mr-8" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-8" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-1/4 hover:cursor-pointer hover:bg-accent">
              <div
                className="flex justify-between items-center"
                onClick={() => updateSort("completedAt")}
              >
                <span>Completed</span>
                {sortBy === "completedAt" && order === "asc" ? (
                  <ArrowUp className="h-3 w-3 mr-8" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-8" />
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id} className="p-2 h-10 rounded-md mb-3">
              <TableCell className="max-w-20">{todo.title}</TableCell>
              <TableCell className="w-1/4">
                {moment(todo.createdAt).format("MM-DD-YY, h:mm A")}
              </TableCell>
              <TableCell className="p-0 m-0 h-15 flex items-center justify-between gap-6">
                {!todo.completedAt ? (
                  <Button
                    className="bg-green-200 text-black hover:bg-green-300"
                    disabled={completeTodo.isPending}
                    onClick={() => completeTodo.mutate(todo.id)}
                  >
                    Complete
                  </Button>
                ) : (
                  <span>
                    {moment(todo.completedAt).format("MM-DD-YY, h:mm A")}
                  </span>
                )}
                <Trash
                  onClick={() => deleteTodo.mutate(todo.id)}
                  className="w-4 h-4 mr-10 text-red-500 hover:cursor-pointer"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
