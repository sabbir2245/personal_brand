import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate image mimetype
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file is not an image" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Create a safe, unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    // Save to disk
    await writeFile(filePath, buffer);

    // Return the accessible public URL path
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("Local upload handler error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
