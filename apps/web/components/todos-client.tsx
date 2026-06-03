"use client";
import { completeTodo, createTodo, deleteTodo, getTodos } from "@/app/page";
import { useState } from "react";
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
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Todo } from "@/types/todo";
import moment from "moment";
import { ArrowDown, ArrowUp, Delete, Trash } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type TodosClientProps = {
  todos: Todo[];
  sortBy?: string;
  order?: string;
};

type SortByOptions = "createdAt" | "completedAt";

export default function TodosClient({
  todos,
  sortBy,
  order,
}: TodosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(nextSortBy: SortByOptions) {
    const currentSort = searchParams.get("sortBy") ?? "createdAt";
    const currentOrder = searchParams.get("order") ?? "asc";

    let nextOrder: "asc" | "desc" = "asc";
    if (currentSort === nextSortBy) {
      nextOrder = currentOrder === "asc" ? "desc" : "asc";
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", nextSortBy);
    params.set("order", nextOrder);

    // reload home page with new params to recieve
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="mx-80 my-40 h-150 flex flex-col gap-2 items-center">
      <form action={createTodo} className="flex gap-2 w-full">
        <Input
          placeholder="What do you need to do?"
          type="text"
          name="title"
          className="w-full"
          required
        />
        <Button>Submit</Button>
      </form>

      <Table className="my-10 mx-auto">
        <TableCaption>A list of your to-do items</TableCaption>
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
          {todos.map((todo: Todo) => {
            return (
              <TableRow key={todo.id} className="p-2 h-10 rounded-md mb-3">
                <TableCell className="max-w-20">{todo.title}</TableCell>
                <TableCell className="w-1/4">
                  {moment(todo.createdAt).format("MM-DD-YY, h:mm A")}
                </TableCell>
                <TableCell className="p-0 m-0 h-15 flex items-center justify-between gap-6">
                  {!todo.completedAt ? (
                    <Button
                      className="bg-green-200 text-black hover:bg-green-300"
                      onClick={() => completeTodo(todo.id)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <span>
                      {moment(todo.completedAt).format("MM-DD-YY, h:mm A")}
                    </span>
                  )}
                  <Trash
                    onClick={() => deleteTodo(todo.id)}
                    className="w-4 h-4 mr-10 text-red-500 hover:cursor-pointer"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
