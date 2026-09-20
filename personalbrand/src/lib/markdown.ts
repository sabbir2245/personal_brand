import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}