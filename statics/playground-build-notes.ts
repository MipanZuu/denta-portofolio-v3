export type PlaygroundBuildNote = {
  intro: string;
  sections: { title: string; body: string }[];
  snippets?: { label: string; title: string; code: string }[];
};

export const playgroundBuildNotes: Record<string, PlaygroundBuildNote> = {
  "/playground/quick-signal": {
    intro: "Quick Signal is deliberately tiny. Most of the work is timing, fairness, and making every click feel immediate.",
    sections: [
      { title: "A 20-second state machine", body: "Idle, playing, and finished are the only phases. The interval exists only while playing, cleans itself up on restart, and lets React own the visible countdown." },
      { title: "Random, but not annoying", body: "A random signal is fun until it appears in the same square twice and looks broken. The picker retries that one case. Wrong taps remove a point, but the score never drops below zero." },
    ],
    snippets: [
      { label: "Fairness", title: "Move the signal every time", code: `let next = Math.floor(Math.random() * GRID_SIZE);
while (next === previous) {
  next = Math.floor(Math.random() * GRID_SIZE);
}` },
      { label: "Scoring", title: "Reward accuracy without negative scores", code: `if (index === activeCell) {
  setScore(value => value + 1);
  setActiveCell(nextCell(activeCell));
} else {
  setScore(value => Math.max(0, value - 1));
}` },
    ],
  },
  "/playground/memory-match": {
    intro: "The whole board is data: sixteen symbols, two open indexes, and a list of completed pairs. There is no game engine hiding behind it.",
    sections: [
      { title: "Two cards are a conversation", body: "The click guard refuses a third card, an already-open card, or a completed pair. Once two are open, they stay visible for 550 milliseconds before the board decides whether they match." },
      { title: "Why matched symbols, not indexes?", body: "Every symbol appears exactly twice, so storing the matched symbol reveals both cards naturally. It also keeps completion as simple as comparing the number of matches with the number of unique marks." },
    ],
    snippets: [{ label: "Game rule", title: "Block impossible moves early", code: `if (
  !playing || open.length === 2 ||
  open.includes(index) || matched.includes(deck[index])
) return;` }],
  },
  "/playground/number-rush": {
    intro: "Number Rush is a short arithmetic sprint. The generator aims for questions that feel varied without suddenly handing someone unpleasant homework.",
    sections: [
      { title: "Questions with guardrails", body: "Operands stay inside friendly ranges, and multiplication appears less often than addition. The answer is stored with the question, so checking never has to parse the displayed operator." },
      { title: "Restarts without ghost timers", body: "A run ID gives every restart a fresh timer lifecycle. Cleanup removes the previous interval, preventing two countdowns from racing each other." },
    ],
    snippets: [{ label: "Generator", title: "Weighted arithmetic", code: `const multiply = Math.random() > 0.62;
return {
  left, right,
  sign: multiply ? "×" : "+",
  answer: multiply ? left * right : left + right,
};` }],
  },
  "/playground/text-pocket": {
    intro: "Text Pocket is a collection of small, predictable text transforms. Nothing is sent away and nothing clever happens behind a loading spinner.",
    sections: [
      { title: "Keep transforms boring", body: "Each button runs one pure function. That makes the result easy to test and avoids a chain of hidden changes the visitor did not ask for." },
      { title: "Stats are derived, not stored", body: "Word count, line count, character count, and reading time are recalculated from the current text with useMemo. There is no second copy of the truth to drift out of sync." },
      { title: "Paragraphs survive cleanup", body: "Whitespace is cleaned line by line first. Only runs of three or more newlines become a normal paragraph break, so intentional structure remains." },
    ],
    snippets: [{ label: "Cleanup", title: "Tidy spaces without flattening paragraphs", code: `value.split("\\n")
  .map(line => line.replace(/\\s+/g, " ").trim())
  .join("\\n")
  .replace(/\\n{3,}/g, "\\n\\n")
  .trim();` }],
  },
  "/playground/json-toolkit": {
    intro: "JSON Toolkit treats the browser's own parser as the authority, then adds useful presentation around it.",
    sections: [
      { title: "Parse once, use everywhere", body: "Live validation produces either a parsed value or a structured error. Format, minify, and sort reuse that result instead of parsing independently and disagreeing." },
      { title: "Arrays keep their meaning", body: "Sorting walks the entire value recursively, but only alphabetizes object keys. Arrays retain their original order because changing it could change the data itself." },
      { title: "Errors should point somewhere", body: "Parser positions are translated into line and column numbers, then paired with the offending line. It is much nicer than a red box that only says invalid." },
    ],
    snippets: [
      { label: "Recursion", title: "Sort nested objects safely", code: `if (Array.isArray(value)) return value.map(sortKeys);
if (value && typeof value === "object") {
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => [key, sortKeys(child)])
  );
}` },
      { label: "Debugging", title: "Turn a character offset into a location", code: `const before = input.slice(0, position);
const line = before.split("\\n").length;
const column = position - before.lastIndexOf("\\n");` },
    ],
  },
  "/playground/percentage-helper": {
    intro: "This tool answers three common percentage questions with the same two fields, then gets out of the way.",
    sections: [
      { title: "Three questions, two inputs", body: "The selected mode changes both labels and formula. The result is derived while typing and formatted to two decimal places, so there is no calculate button or stale answer." },
      { title: "Zero gets a human answer", body: "Ratios and percentage change can divide by zero. Those paths return a clear message instead of showing Infinity or NaN." },
    ],
  },
  "/playground/image-lab": {
    intro: "Image Lab is a file workflow with no upload step. The browser decodes, redraws, encodes, previews, and downloads the image itself.",
    sections: [
      { title: "One canvas, three formats", body: "The chosen dimensions become the Canvas size. High-quality smoothing handles resizing, and toBlob asks the browser to encode WebP, PNG, or JPEG." },
      { title: "JPEG needs a background", body: "PNG and WebP can preserve transparency. JPEG cannot, so the canvas is filled white before drawing to avoid surprising black transparent areas." },
      { title: "Object URLs have a cleanup bill", body: "Local previews use temporary blob URLs. They are revoked when the image changes or the component leaves the page, so repeated edits do not quietly consume memory." },
    ],
    snippets: [{ label: "Encoding", title: "Ask the browser for the selected format", code: `canvas.toBlob(
  blob => blob ? resolve(blob) : reject(),
  selected.mime,
  format === "png" ? undefined : quality / 100
);` }],
  },
  "/playground/sharesnap": {
    intro: "ShareSnap uses one draft to answer a visual question: what will this link feel like when it lands in four different feeds?",
    sections: [
      { title: "One draft, four visual rules", body: "URL, title, description, and image live in one state model. Each platform card applies its own crop, spacing, colors, and text limits without duplicating the content." },
      { title: "Typesetting without the DOM", body: "The downloadable OG card is drawn on a 1200 by 630 Canvas. Since Canvas has no automatic line wrapping, every candidate line is measured before a word is added." },
      { title: "Uploaded means local", body: "The selected image becomes a temporary browser URL. It can appear in previews and on the exported card without becoming a public asset." },
    ],
    snippets: [{ label: "Canvas type", title: "Wrap a headline by measured width", code: `for (const word of title.split(" ")) {
  const candidate = line ? \`${'${line} ${word}'}\` : word;
  if (context.measureText(candidate).width > maxWidth) {
    lines.push(line);
    line = word;
  } else line = candidate;
}` }],
  },
  "/playground/preset-studio": {
    intro: "Preset Studio starts with my actual Lightroom XMP files, then translates the parts a browser can reasonably reproduce into a smaller photo pipeline.",
    sections: [
      { title: "Real recipes, parsed once", body: "At build time, the site reads all preset files and extracts exposure, contrast, highlights, shadows, whites, blacks, temperature, tint, vibrance, saturation, and vignette. Visitors receive only that compact data." },
      { title: "Fast preview, full-size export", body: "The live Canvas is capped at a sensible preview size. Downloading redraws the original dimensions, so interaction stays responsive without shrinking the final photo." },
      { title: "Not Lightroom in disguise", body: "Canvas filters cover the broad character and custom passes add warmth, tint, and vignette. Camera profiles, masks, calibration, and Adobe's color engine are deliberately not claimed as supported." },
    ],
    snippets: [
      { label: "Translation", title: "Map XMP controls to a browser filter", code: `const brightness = 1 + exposure * .18 + shadows * .0012;
const contrast = 1 + presetContrast / 100;
const saturation = 1 + saturationValue / 100 + vibrance / 170;
context.filter = \`brightness(${'${brightness}'}) contrast(${'${contrast}'}) saturate(${'${saturation}'})\`;` },
      { label: "Export", title: "Preview small, render the original later", code: `canvas.width = photo.image.naturalWidth;
canvas.height = photo.image.naturalHeight;
drawPhoto(context, photo.image, canvas.width, canvas.height, current);` },
    ],
  },
};
