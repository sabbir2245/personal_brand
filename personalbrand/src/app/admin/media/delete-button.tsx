"use client";

import { useTransition } from "react";
import { deleteMedia } from "../actions";

export function DeleteMedia({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await deleteMedia(formData);
        });
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
      >
        {pending ? "Removing..." : "Remove"}
      </button>
    </form>
  );
}
