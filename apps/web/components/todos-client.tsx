"use client";
import { completeTodo, createTodo, getTodos } from "@/app/page";
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

type TodosClientProps = {
  todos: Todo[];
};

export default function TodosClient({ todos }: TodosClientProps) {
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");

  return (
    <div className="m-50 h-full flex flex-col gap-2 items-center">
      <form action={createTodo} className="flex gap-2">
        <Input
          placeholder="What do you need to do?"
          className="w-100"
          type="text"
          name="title"
          required
        />
        <Button>Submit</Button>
      </form>

      <Table className="mt-10 w-250 mx-auto">
        <TableCaption>A list of your to-do items</TableCaption>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="w-[90%]">Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex flex-col">
          {todos.map((todo: Todo) => {
            console.log(todo);
            return (
              <TableRow
                key={todo.id}
                className=" flex gap-2 justify-between items-center p-2 rounded-md border border-blue-300 mb-3"
              >
                <TableCell>{todo.title}</TableCell>
                <TableCell className="justify-center items-center p-0 m-0 h-10 flex">
                  {!todo.completedAt ? (
                    <Button
                      className="bg-green-200 text-black hover:bg-green-300"
                      onClick={() => completeTodo(todo.id)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <span>
                      Completed{" "}
                      {moment(todo.completedAt).format("MM-DD-YY, h:mm A")}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
