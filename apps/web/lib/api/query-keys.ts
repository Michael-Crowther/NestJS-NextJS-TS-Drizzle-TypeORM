import type { TodoListParams } from "./todos";

/**
 * Central query keys — copy this pattern for books/authors/etc:
 *   bookKeys.list({ search })
 */
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (params: TodoListParams = {}) =>
    [...todoKeys.lists(), params] as const,
};
