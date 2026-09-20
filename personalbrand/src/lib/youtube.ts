const YOUTUBE_ID_PATTERNS = [
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  /youtu\.be\/([\w-]{11})/,
];

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}