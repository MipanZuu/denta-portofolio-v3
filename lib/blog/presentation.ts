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

export function formatBlogDate(date: Date | string | null) {
  if (!date) return "Recently";
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(parsedDate);
}

export function formatCompactCount(count: number) {
  if (count < 1_000) return count.toLocaleString("en");
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count);
}

export function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}
