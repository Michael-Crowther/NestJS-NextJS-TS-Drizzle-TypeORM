"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import type { Tag } from "@/types";

type TagsMultiComboboxProps = {
  tags: Tag[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export function TagsMultiCombobox({
  tags,
  value,
  onChange,
  placeholder = "Select tags...",
}: TagsMultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = tags.filter((tag) => value.includes(tag.id));

  function toggle(tagId: string) {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
      return;
    }
    onChange([...value, tagId]);
  }

  function remove(tagId: string) {
    onChange(value.filter((id) => id !== tagId));
  }

  return (
    <div className="space-y-2">
      {/* FormData: multiple values under the same name */}
      {value.map((id) => (
        <input key={id} type="hidden" name="tagIds" value={id} />
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-9 w-full justify-between px-3 py-2 font-normal"
          >
            <span className="truncate text-muted-foreground">
              {selected.length > 0
                ? `${selected.length} tag${selected.length === 1 ? "" : "s"} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[100] w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => {
                  const isSelected = value.includes(tag.id);
                  return (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => toggle(tag.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {tag.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="gap-1 pr-1">
              {tag.name}
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-muted"
                onClick={() => remove(tag.id)}
                aria-label={`Remove ${tag.name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
