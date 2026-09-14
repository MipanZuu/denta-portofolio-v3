import { blogPageStatusValues, type BlogPageStatus } from "@/db/schema";

export type BlogPageInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  secondaryContent: string;
  thirdContent: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  coverImageUrl: string | null;
  images: string;
  tags: string;
  status: BlogPageStatus;
};

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseBlogPageForm(formData: FormData): BlogPageInput {
  const title = value(formData, "title");
  const slug = normalizeSlug(value(formData, "slug") || title);
  const excerpt = value(formData, "excerpt");
  const content = value(formData, "content");
  const statusValue = value(formData, "status");
  const status = blogPageStatusValues.includes(statusValue as BlogPageStatus)
    ? (statusValue as BlogPageStatus)
    : "DRAFT";
  const rawCoverImageUrl = value(formData, "coverImageUrl");
  const imageUrls = value(formData, "images")
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.startsWith("https://"));
  const tags = [...new Set(value(formData, "tags")
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, "").replace(/\s+/g, " "))
    .filter(Boolean)
    .slice(0, 10))];

  if (!title || !slug || !excerpt || !content)
    throw new Error("Title, slug, excerpt, and main content are required.");

  return {
    title,
    slug,
    excerpt,
    content,
    secondaryContent: value(formData, "secondaryContent"),
    thirdContent: value(formData, "thirdContent"),
    seoMetaTitle: value(formData, "seoMetaTitle") || title,
    seoMetaDescription: value(formData, "seoMetaDescription") || excerpt,
    coverImageUrl: rawCoverImageUrl.startsWith("https://") ? rawCoverImageUrl : null,
    images: JSON.stringify(imageUrls),
    tags: JSON.stringify(tags),
    status,
  };
}
