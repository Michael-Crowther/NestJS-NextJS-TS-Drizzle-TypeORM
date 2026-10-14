"use client";
import { Book } from "@/types";
import { Genre } from "@/types";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Field, FieldGroup } from "@workspace/ui/components/field";
import { Label } from "@workspace/ui/components/label";
import React, { useState } from "react";
import { createGenre } from "@/app/actions/genres";
import { createBook, deleteBook, updateBook } from "@/app/actions/books";
import { Pencil, Trash } from "lucide-react";

type BookClientProps = {
  books: Book[];
  genres: Genre[];
  sortBy?: string;
  order?: string;
};

const bookStatusOptions = [
  { value: "to_read", label: "To Read" },
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
];

type DialogModes = "create" | "edit";

export default function BooksClient({
  books,
  genres,
  sortBy,
  order,
}: BookClientProps) {
  const [genreDialogOpen, setGenreDialogOpen] = useState(false);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogModes>("create");
  const [selectedBookId, setSelectedBookId] = useState<string>("");

  const selectedBook = books.find((book) => book.id === selectedBookId);

  const handleSubmit = (formData: FormData) => {
    if (dialogMode === "create") {
      createBook(formData);
    } else {
      updateBook(selectedBookId, formData);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Input placeholder="Search books..." />
        <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedBookId("");
                setDialogMode("create");
              }}
            >
              Create Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <form
              action={handleSubmit}
              onSubmit={() => setBookDialogOpen(false)}
            >
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === "create" ? "Create Book" : "Edit Book"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details to{" "}
                  {dialogMode === "create" ? "create" : "edit"} a new book.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="title-1">Title</Label>
                  <Input
                    id="title-1"
                    name="title"
                    defaultValue={selectedBook?.title || "Hunger Games"}
                  />
                </Field>
                <Field>
                  <Label htmlFor="author-1">Author</Label>
                  <Input
                    id="author-1"
                    name="author"
                    defaultValue={selectedBook?.author || "Suzanne Collins"}
                  />
                </Field>

                <div className="flex gap-4">
                  <Field className="w-1/3">
                    <Label htmlFor="status-1">Status</Label>
                    <Select
                      name="status"
                      defaultValue={selectedBook?.status || "to_read"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          {bookStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="w-1/3">
                    <Label htmlFor="genre-1">Genre</Label>
                    <Select
                      name="genreId"
                      defaultValue={selectedBook?.genreId || "Fiction"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Genre</SelectLabel>
                          {genres.map((genre) => (
                            <SelectItem key={genre.id} value={genre.id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field className="w-1/3">
                    <Label htmlFor="rating-1">Rating</Label>
                    <Input
                      id="rating-1"
                      name="rating"
                      type="number"
                      min={1}
                      max={5}
                      placeholder="1-5"
                      defaultValue={selectedBook?.rating || 2}
                    />
                  </Field>
                </div>
              </FieldGroup>
              <DialogFooter className="mt-8">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={genreDialogOpen} onOpenChange={setGenreDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Genre</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create Genre</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new genre.
              </DialogDescription>
            </DialogHeader>
            <form
              action={createGenre}
              onSubmit={() => setGenreDialogOpen(false)}
            >
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Name</Label>
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="Enter genre name"
                    className="mb-2"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Genre</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="my-10 mx-auto">
        <TableCaption>A list of your books</TableCaption>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book: Book) => {
            return (
              <TableRow key={book.id} className="p-2 h-10 rounded-md mb-3">
                <TableCell className="max-w-20">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  {bookStatusOptions.find((o) => o.value === book.status)
                    ?.label ?? book.status}
                </TableCell>
                <TableCell>{book.rating}</TableCell>
                <TableCell>{book.genre?.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBookDialogOpen(true);
                      setDialogMode("edit");
                      setSelectedBookId(book.id);
                    }}
                  >
                    <Pencil />
                  </Button>

                  <Button variant="outline" onClick={() => deleteBook(book.id)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
