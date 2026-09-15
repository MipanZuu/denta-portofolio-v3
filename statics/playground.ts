export type PlaygroundItem = {
  title: string;
  slug: string;
  href: string;
  description: string;
  kind: "game" | "tool";
  recommended?: boolean;
};

export const playgroundGames: PlaygroundItem[] = [
  {
    title: "Quick Signal",
    slug: "quick-signal",
    href: "/playground/quick-signal",
    description: "Catch the bright square before twenty seconds run out.",
    kind: "game",
    recommended: true,
  },
  {
    title: "Memory Match",
    slug: "memory-match",
    href: "/playground/memory-match",
    description: "Flip the tiles and find all eight matching pairs.",
    kind: "game",
    recommended: true,
  },
  {
    title: "Number Rush",
    slug: "number-rush",
    href: "/playground/number-rush",
    description: "Solve quick sums and keep your streak alive.",
    kind: "game",
  },
];

export const playgroundTools: PlaygroundItem[] = [
  {
    title: "Denta Preset Studio",
    slug: "preset-studio",
    href: "/playground/preset-studio",
    description: "Try my Lightroom-inspired presets on your own photo.",
    kind: "tool",
    recommended: true,
  },
  {
    title: "Image Lab",
    slug: "image-lab",
    href: "/playground/image-lab",
    description: "Resize, compress, and convert images without uploading them.",
    kind: "tool",
    recommended: true,
  },
  {
    title: "Text Pocket",
    slug: "text-pocket",
    href: "/playground/text-pocket",
    description: "Count, clean, and reshape any block of text.",
    kind: "tool",
  },
  {
    title: "JSON Toolkit",
    slug: "json-toolkit",
    href: "/playground/json-toolkit",
    description: "Format, minify, validate, sort, and copy JSON.",
    kind: "tool",
  },
  {
    title: "Percentage Helper",
    slug: "percentage-helper",
    href: "/playground/percentage-helper",
    description: "Answer everyday percentage questions without a formula hunt.",
    kind: "tool",
  },
  {
    title: "ShareSnap",
    slug: "sharesnap",
    href: "/playground/sharesnap",
    description: "Preview social cards and generate a clean Open Graph image.",
    kind: "tool",
  },
];

export const playgroundItems = [...playgroundGames, ...playgroundTools];
