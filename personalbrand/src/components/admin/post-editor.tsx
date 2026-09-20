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

const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400";

export function PostEditor({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [markdown, setMarkdown] = useState(post.markdown);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [featured_image, setFeaturedImage] = useState(post.featured_image);
  const [preview, setPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) throw new Error("Please upload an image file.");
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setFeaturedImage(url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setFeaturedImage(url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const url = await uploadFile(file);
      const insertText = `![image](${url})`;
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart ?? markdown.length;
        const end = ta.selectionEnd ?? markdown.length;
        const newMd = markdown.slice(0, start) + "\n" + insertText + "\n" + markdown.slice(end);
        setMarkdown(newMd);
        requestAnimationFrame(() => {
          ta.focus();
          const pos = start + insertText.length + 2;
          ta.setSelectionRange(pos, pos);
        });
      } else {
        setMarkdown((prev) => prev + "\n" + insertText + "\n");
      }
    } catch {
      // silent fail for content drops
    }
  };

  return (
    <form action={savePost} className="mt-6 grid gap-5">
      {post.id && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
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
        <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
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

      <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
        Excerpt
        <textarea name="excerpt" className={inputClass} rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </label>

      {/* Featured Image: Drag & Drop Zone */}
      <div className="grid gap-1.5">
        <span className="text-sm font-medium text-gray-900 dark:text-white">Featured Image</span>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input-featured")?.click()}
          className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          }`}
        >
          <input
            type="file"
            id="file-input-featured"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <svg className="h-6 w-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Uploading...</span>
            </div>
          ) : featured_image ? (
            <div className="group relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured_image} alt="Featured image preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-semibold text-white">Drag or click to replace</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center text-sm text-gray-500">
              <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-white">Drag & drop an image</p>
              <p className="mt-0.5 text-xs text-gray-500">or click to browse</p>
            </div>
          )}
          {uploadError && (
            <p className="absolute bottom-2 text-center text-xs font-medium text-red-500">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Image URL field */}
      <label className="grid gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
        Image URL / Path
        <textarea
          name="featured_image"
          className={`${inputClass} h-20 resize-none font-mono text-xs`}
          value={featured_image}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="Image URL will fill here on upload, or paste an external URL..."
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Content (Markdown)</span>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400"
          >
            {preview ? "← Edit" : "Preview →"}
          </button>
        </div>

        {preview ? (
          <div
            className="prose prose-sm max-w-none rounded-lg border border-gray-200 px-6 py-4 dark:border-gray-800 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            required
            name="markdown"
            rows={18}
            className={`${inputClass} w-full font-mono resize-y`}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write in Markdown..."
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleContentDrop}
          />
        )}
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
        <input type="checkbox" name="is_published" defaultChecked={post.is_published} className="h-4 w-4 rounded" />
        Publish now
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Save post
        </button>
        {!post.id && (
          <Link href="/admin/posts" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
