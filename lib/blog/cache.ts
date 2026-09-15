export const BLOG_CACHE_TAGS = {
  posts: "blog-posts",
  feed: "blog-feed",
  comments: "blog-comments",
} as const;

export const BLOG_CACHE_TIMES = {
  feed: 60,
  post: 60 * 60,
  comments: 60 * 60,
} as const;
