export function parseBlogImages(images: string) {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.startsWith("https://")) : [];
  } catch {
    return [];
  }
}

export function getBlogMedia(coverImageUrl: string | null, images: string) {
  return Array.from(new Set([coverImageUrl, ...parseBlogImages(images)].filter((image): image is string => Boolean(image))));
}

export function parseBlogTags(tags: string) {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
  } catch {
    return [];
  }
}

export function formatBlogDate(date: Date | null) {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
