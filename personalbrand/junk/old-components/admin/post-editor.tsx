"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { markdownToHtml, slugify } from "@/lib/markdown";
import { savePost } from "@/app/admin/actions";

type Post = {
  id?: string;
  title: string;
  slug: string;
  markdown: string;
  excerpt: string;
  featured_image: string;
  is_published?: boolean;
};

export function PostEditor({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [markdown, setMarkdown] = useState(post.markdown);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [featured_image, setFeaturedImage] = useState(post.featured_image);
  const [preview, setPreview] = useState(false);

  // Featured image upload state
  const [isDraggingFeatured, setIsDraggingFeatured] = useState(false);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [featuredUploadError, setFeaturedUploadError] = useState<string | null>(null);

  // Content area drag-to-insert state
  const [isDraggingContent, setIsDraggingContent] = useState(false);
  const [isUploadingContent, setIsUploadingContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const inputClass =
    "rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(0,82,255,0.15)] dark:bg-[var(--muted)] dark:text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]";

  // ── Generic upload helper ────────────────────────────────────────
  const uploadFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload an image file.");
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to upload image");
    }
    const data = await res.json();
    return data.url as string;
  };

  // ── Featured image handlers ──────────────────────────────────────
  const handleFeaturedUpload = async (file: File) => {
    setFeaturedUploadError(null);
    setIsUploadingFeatured(true);
    try {
      const url = await uploadFile(file);
      setFeaturedImage(url);
    } catch (err: any) {
      setFeaturedUploadError(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingFeatured(false);
    }
  };

  const onFeaturedDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFeatured(false);
    if (e.dataTransfer.files?.[0]) await handleFeaturedUpload(e.dataTransfer.files[0]);
  };

  const onFeaturedFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) await handleFeaturedUpload(e.target.files[0]);
  };

  // ── Content area drag-to-insert handlers ────────────────────────
  const handleContentImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingContent(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setIsUploadingContent(true);
    try {
      const url = await uploadFile(file);
      const insertText = `![image](${url})`;

      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart ?? markdown.length;
        const end = ta.selectionEnd ?? markdown.length;
        const newMarkdown = markdown.slice(0, start) + "\n" + insertText + "\n" + markdown.slice(end);
        setMarkdown(newMarkdown);

        // Restore focus and move cursor after inserted text
        requestAnimationFrame(() => {
          ta.focus();
          const newPos = start + insertText.length + 2;
          ta.setSelectionRange(newPos, newPos);
        });
      } else {
        setMarkdown((prev) => prev + "\n" + insertText + "\n");
      }
    } catch {
      // silently fail on content drop — no disruptive error for inline images
    } finally {
      setIsUploadingContent(false);
    }
  };

  return (
    <form action={savePost} className="mt-6 grid gap-5">
      {post.id && <input type="hidden" name="id" value={post.id} />}

      {/* Title + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
          Title
          <input
            required
            name="title"
            className={inputClass}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post.id) setSlug(slugify(e.target.value));
            }}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
          Slug
          <input
            required
            name="slug"
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
        </label>
      </div>

      {/* Excerpt */}
      <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
        Excerpt
        <textarea
          name="excerpt"
          className={inputClass}
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </label>

      {/* Featured image: drag-drop zone + URL field */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]">Featured Image Upload</span>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFeatured(true); }}
            onDragLeave={() => setIsDraggingFeatured(false)}
            onDrop={onFeaturedDrop}
            onClick={() => document.getElementById("file-input-featured")?.click()}
            className={`relative flex min-h-[144px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all duration-200 ${
              isDraggingFeatured
                ? "border-[var(--accent)] bg-[rgba(0,82,255,0.05)] shadow-[var(--shadow-accent)]"
                : "border-[var(--border)] hover:border-[rgba(0,82,255,0.4)] hover:bg-[rgba(0,82,255,0.02)]"
            }`}
          >
            <input
              type="file"
              id="file-input-featured"
              accept="image/*"
              className="hidden"
              onChange={onFeaturedFileSelect}
              disabled={isUploadingFeatured}
            />

            {isUploadingFeatured ? (
              <div className="flex flex-col items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <svg className="h-6 w-6 animate-spin text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Uploading…</span>
              </div>
            ) : featured_image ? (
              <div className="group relative h-24 w-full overflow-hidden rounded-lg bg-[var(--muted)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured_image} alt="Featured image preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-semibold text-white">Drag or click to replace</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center text-sm text-[var(--muted-foreground)]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-accent text-white shadow-[var(--shadow-accent)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <p className="font-medium text-[var(--foreground)]">Drag &amp; drop an image</p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">or click to browse</p>
              </div>
            )}
            {featuredUploadError && (
              <p className="absolute bottom-2 text-center text-xs font-medium text-red-500">{featuredUploadError}</p>
            )}
          </div>
        </div>

        <label className="grid gap-1.5 text-sm font-medium text-[var(--foreground)]">
          Featured Image URL / Path
          <textarea
            name="featured_image"
            className={`${inputClass} h-[144px] resize-none font-mono text-xs`}
            value={featured_image}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="Image path will automatically fill here on upload, or paste an external URL…"
          />
        </label>
      </div>

      {/* Content / Markdown editor */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]">Content</span>
            {/* Inline image upload hint */}
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,82,255,0.2)] bg-[rgba(0,82,255,0.05)] px-2 py-0.5 font-mono-brand text-[0.6rem] uppercase tracking-wider text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Drag image to insert inline
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:border-[rgba(0,82,255,0.3)] hover:text-[var(--accent)]"
          >
            {preview ? "← Edit" : "Preview →"}
          </button>
        </div>

        {preview ? (
          <div
            className="prose prose-neutral max-w-none rounded-xl border border-[var(--border)] px-6 py-4 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
          />
        ) : (
          <div className="relative">
            {/* Content area drag overlay */}
            {isDraggingContent && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-[var(--accent)] bg-[rgba(0,82,255,0.08)] shadow-[var(--shadow-accent)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-accent text-white shadow-[var(--shadow-accent)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[var(--accent)]">Drop to insert image</p>
              </div>
            )}
            {isUploadingContent && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-[var(--accent)] bg-[rgba(0,82,255,0.08)]">
                <svg className="h-6 w-6 animate-spin text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm font-semibold text-[var(--accent)]">Uploading image…</p>
              </div>
            )}
            <textarea
              ref={textareaRef}
              required
              name="markdown"
              rows={18}
              className={`${inputClass} w-full font-mono resize-y`}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={"Write in Markdown…\n\n## Heading\n\nSome **bold** text and a [link](https://example.com).\n\n<!-- Drag an image file here to upload and insert it inline -->"}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingContent(true); }}
              onDragLeave={() => setIsDraggingContent(false)}
              onDrop={handleContentImageDrop}
            />
          </div>
        )}
      </div>

      {/* Publish toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-[var(--foreground)]">
        <span className="relative inline-flex items-center">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post.is_published}
            className="peer sr-only"
          />
          <span className="h-5 w-9 rounded-full border border-[var(--border)] bg-[var(--muted)] transition-all duration-200 peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]" />
          <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 peer-checked:translate-x-4" />
        </span>
        Publish now
        <span className="font-normal text-[var(--muted-foreground)]">(dispatches email newsletter to all subscribers)</span>
      </label>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="btn-primary"
        >
          Save post
        </button>
        {!post.id && (
          <Link
            href="/admin/posts"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:border-[rgba(0,82,255,0.3)] hover:text-[var(--accent)]"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}