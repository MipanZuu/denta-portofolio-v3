"use client";

import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Heart,
  Lightbulb,
  MessageCircle,
  Moon,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import docs from "@/statics/docs-next.json";
import { navigation } from "@/statics/navigation";
import { playgroundItems } from "@/statics/playground";

type Action = { label: string; href?: string; command?: "dark" | "light" };
type Message = {
  role: "companion" | "visitor";
  text: string;
  actions?: Action[];
};

const welcome: Message = {
  role: "companion",
  text: "Hi, I’m Mizu, the tiny creature keeping this orbit tidy. Ask me where something lives, what Denta builds, or tell me to change the theme. Nothing you type here is sent or saved.",
  actions: [
    { label: "Find a project", href: "/projects" },
    { label: "Learn Next.js", href: "/docs/nextjs" },
    { label: "Pick something fun", href: "/playground" },
  ],
};

const routeAliases: Record<string, string[]> = {
  "/": ["home", "landing", "start", "front page"],
  "/about": ["about", "bio", "profile", "who is denta"],
  "/journey": ["journey", "timeline", "history", "story"],
  "/experience": ["experience", "career", "jobs", "work history"],
  "/technologies": ["technologies", "technology", "tech", "stack", "tools"],
  "/projects": ["projects", "portfolio", "work", "case studies"],
  "/blog": ["blog", "articles", "writing", "posts"],
  "/docs": ["docs", "documentation", "learn", "guides", "tutorials"],
  "/playground": ["playground", "games", "experiments", "interactive tools"],
  "/space": ["space", "universe", "black hole"],
  "/contact": ["contact", "email", "hire", "collaborate", "get in touch"],
};

function normalizeText(value?: string | null) {
  if (!value) return "";

  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(
  value: string | null | undefined,
  terms: Array<string | null | undefined>,
) {
  const normalized = normalizeText(value);

  if (!normalized) return false;

  const words = normalized.split(" ").filter(Boolean);

  return terms.some((term) => {
    const normalizedTerm = normalizeText(term);

    if (!normalizedTerm) return false;

    if (normalized.includes(normalizedTerm)) return true;

    return normalizedTerm
      .split(" ")
      .filter(Boolean)
      .every((termWord) => words.some((word) => closeEnough(word, termWord)));
  });
}

function editDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const previous = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        diagonal + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      diagonal = previous;
    }
  }
  return row[right.length];
}

function closeEnough(left: string, right: string) {
  if (left === right || left.includes(right) || right.includes(left))
    return true;
  const longest = Math.max(left.length, right.length);
  return longest >= 4 && editDistance(left, right) <= (longest >= 8 ? 2 : 1);
}

function findRoute(value: string) {
  return navigation.find((item) =>
    matches(value, [
      item.section,
      item.label,
      ...(routeAliases[item.href] ?? []),
    ]),
  );
}

function findDoc(value: string) {
  return docs.sections.find((section) => {
    const terms = [
      section.id,
      section.title,
      ...section.title
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 4),
    ];
    return matches(value, terms);
  });
}

function findPlaygroundItem(value: string) {
  return playgroundItems.find((item) =>
    matches(value, [item.slug, item.title, item.description]),
  );
}

export function PortfolioCompanion() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [petAnimation, setPetAnimation] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const petTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [open, messages]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      if (petTimerRef.current) window.clearTimeout(petTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let promptTimer = 0;
    let hideTimer = 0;
    const schedule = () => {
      promptTimer = window.setTimeout(
        () => {
          if (!open && !menuOpen) {
            setNudge(true);
            hideTimer = window.setTimeout(() => setNudge(false), 7500);
          }
          schedule();
        },
        10000 + Math.random() * 20000,
      );
    };
    schedule();
    return () => {
      window.clearTimeout(promptTimer);
      window.clearTimeout(hideTimer);
    };
  }, [open, menuOpen]);

  function petMizu() {
    const animations = [
      "is-petted",
      "is-hopping",
      "is-spinning",
      "is-wiggling",
    ];
    if (petTimerRef.current) window.clearTimeout(petTimerRef.current);
    setNudge(false);
    setMenuOpen(false);
    setPetAnimation("");
    window.requestAnimationFrame(() => {
      setPetAnimation(
        animations[Math.floor(Math.random() * animations.length)],
      );
      petTimerRef.current = window.setTimeout(() => setPetAnimation(""), 1300);
    });
  }

  function openChat() {
    setMenuOpen(false);
    setNudge(false);
    setOpen(true);
  }

  function setTheme(theme: "dark" | "light") {
    const dark = theme === "dark";
    document.body.classList.toggle("dark-portfolio", dark);
    window.localStorage.setItem("portfolio-theme", theme);
    window.dispatchEvent(
      new CustomEvent("portfolio-theme-change", { detail: { dark } }),
    );
  }

  function runAction(action: Action) {
    if (action.command) {
      setTheme(action.command);
      setMessages((current) => [
        ...current,
        {
          role: "companion",
          text: `${action.command === "dark" ? "Dark" : "Light"} mode is on. Much better for ${action.command === "dark" ? "late-night orbiting" : "sunny-side reading"}.`,
        },
      ]);
    }
    if (action.href) {
      setOpen(false);
      router.push(action.href);
    }
  }

  function answer(raw: string): Message {
    const value = normalizeText(raw);
    const wantsNavigation = matches(value, [
      "go",
      "open",
      "take me",
      "navigate",
      "show",
      "visit",
      "bring me",
      "send me",
      "lead me",
      "guide me",
      "direct me",
      "where is",
    ]);
    const asksPrivate = matches(value, [
      "address",
      "home address",
      "where does denta live",
      "where does he live",
      "phone",
      "phone number",
      "personal email",
      "private email",
      "salary",
      "income",
      "money",
      "password",
      "private",
      "personal information",
      "personal info",
      "date of birth",
      "birthday",
      "age",
      "family",
      "parents",
      "mother",
      "father",
      "girlfriend",
      "boyfriend",
      "partner",
      "relationship",
      "relationship status",
      "personal life",
    ]);

    if (asksPrivate)
      return {
        role: "companion",
        text: "Ooh, going off-script, are we? I only talk about what my boss Denta has chosen to make public on this website — his work, projects, skills, writing, and other portfolio stuff. Personal details stay out of my tiny digital mouth.",
        actions: [
          { label: "About Denta", href: "/about" },
          { label: "See his work", href: "/projects" },
        ],
      };
    if (matches(value, ["light mode", "turn light", "lights on", "day mode"])) {
      setTheme("light");
      return {
        role: "companion",
        text: "Light mode is on. The planets have entered daylight.",
      };
    }
    if (
      matches(value, ["dark mode", "turn dark", "lights off", "night mode"])
    ) {
      setTheme("dark");
      return {
        role: "companion",
        text: "Dark mode is on. Welcome back to deep space.",
      };
    }
    if (matches(value, ["theme", "appearance", "colour mode", "color mode"]))
      return {
        role: "companion",
        text: "I can switch the whole site, not just this chat.",
        actions: [
          { label: "Dark mode", command: "dark" },
          { label: "Light mode", command: "light" },
        ],
      };

    const doc = findDoc(value);
    if (
      doc &&
      (matches(value, [
        "learn",
        "docs",
        "guide",
        "explain",
        "nextjs",
        "where",
        "read",
      ]) ||
        wantsNavigation)
    ) {
      const href = `/docs/nextjs/${doc.id}`;
      if (wantsNavigation) {
        window.setTimeout(() => {
          setOpen(false);
          router.push(href);
        }, 450);
      }
      return {
        role: "companion",
        text: `The “${doc.title}” chapter is the best match. It covers ${doc.summary.charAt(0).toLowerCase()}${doc.summary.slice(1)}`,
        actions: wantsNavigation
          ? undefined
          : [{ label: `Read ${doc.title}`, href }],
      };
    }

    const playgroundItem = findPlaygroundItem(value);
    if (playgroundItem)
      return {
        role: "companion",
        text: `${playgroundItem.title} is ${playgroundItem.description.toLowerCase()} It runs in the browser, so your input stays on your device.`,
        actions: [
          { label: `Open ${playgroundItem.title}`, href: playgroundItem.href },
        ],
      };

    const route = findRoute(value);
    if (route && wantsNavigation) {
      window.setTimeout(() => {
        setOpen(false);
        router.push(route.href);
      }, 400);
      return {
        role: "companion",
        text: `Course set for ${route.label}. Hold onto something suitably space-shaped.`,
      };
    }

    if (
      matches(value, [
        "what is this website",
        "what is this site",
        "what website is this",
        "what is this",
        "where am i",
        "tell me about this website",
        "tell me about this site",
        "what can i find here",
        "what is denta portfolio",
      ])
    )
      return {
        role: "companion",
        text: "You’ve landed on Denta’s little corner of the internet. It’s his personal portfolio — part project archive, part notebook, part playground, and apparently part home for me too. You can explore what he’s built, read about his experience and journey, browse his writing and docs, or mess around with the experiments in Playground. I’m here to stop you from getting lost. Mostly.",
        actions: [
          { label: "Meet Denta", href: "/about" },
          { label: "Explore projects", href: "/projects" },
          { label: "Open Playground", href: "/playground" },
        ],
      };

    if (
      matches(value, [
        "who is denta",
        "who's denta",
        "whos denta",
        "tell me about denta",
        "about denta",
        "who made this website",
        "who made this site",
        "who built this",
        "who is your boss",
        "your boss",
        "your creator",
      ])
    )
      return {
        role: "companion",
        text: "Ah, my boss. Denta is the person behind this whole place — software engineer, builder of digital things, occasional experimenter, and the reason I have a job. I only talk about what he has made public here, though. His work, projects, technologies, writing, and journey are fair game. His private life? Nice try.",
        actions: [
          { label: "About Denta", href: "/about" },
          { label: "See his projects", href: "/projects" },
          { label: "Follow his journey", href: "/journey" },
        ],
      };

    if (
      matches(value, [
        "who are you",
        "what are you",
        "what is mizu",
        "who is mizu",
        "tell me about yourself",
        "are you ai",
        "are you a bot",
      ])
    )
      return {
        role: "companion",
        text: "I’m Mizu. Tiny creature, local guide, professional button sitter. My job is to help you explore Denta’s website without making you hunt through every page like it’s a side quest. Ask me about his public work, projects, technologies, docs, Playground experiments, or where something lives.",
        actions: [
          { label: "What can you do?", href: "/about" },
          { label: "Explore the site", href: "/" },
        ],
      };

    if (
      matches(value, [
        "denta",
        "about denta",
        "denta bramasta",
        "creator",
        "developer",
      ])
    )
      return {
        role: "companion",
        text: "You mean my boss? Denta is the person behind this portfolio. He builds software, experiments with ideas, writes about things he learns, and occasionally gives me more pages to guard. Everything I know about him comes from the public side of this website — I don't gossip.",
        actions: [
          { label: "Read about Denta", href: "/about" },
          { label: "Explore his work", href: "/projects" },
        ],
      };
    if (matches(value, ["project", "portfolio", "built", "work", "case study"]))
      return {
        role: "companion",
        text: "The Projects page is the quickest overview of finished product work. Experience explains the responsibilities and impact behind it, while Playground shows the experimental side.",
        actions: [
          { label: "Projects", href: "/projects" },
          { label: "Experience", href: "/experience" },
          { label: "Playground", href: "/playground" },
        ],
      };
    if (
      matches(value, ["skill", "stack", "technology", "framework", "language"])
    )
      return {
        role: "companion",
        text: "The technology map groups the stack by purpose, including languages, frontend, backend, databases, tooling, and infrastructure. The docs go deeper into how those choices work in practice.",
        actions: [
          { label: "Technology map", href: "/technologies" },
          { label: "Open docs", href: "/docs" },
        ],
      };
    if (matches(value, ["game", "fun", "bored", "play", "experiment"]))
      return {
        role: "companion",
        text: "For a quick break, try Quick Signal or Memory Match. If you want something useful instead, Image Lab and Denta Preset Studio are the crowd favourites.",
        actions: [
          { label: "Quick Signal", href: "/playground/quick-signal" },
          { label: "Memory Match", href: "/playground/memory-match" },
          { label: "Image Lab", href: "/playground/image-lab" },
        ],
      };
    if (
      matches(value, [
        "contact",
        "hire",
        "collaborate",
        "talk",
        "message",
        "email",
      ])
    )
      return {
        role: "companion",
        text: "The Contact page has the public ways to start a conversation. I will guide you there, but I will not invent or reveal private contact details.",
        actions: [{ label: "Open contact", href: "/contact" }],
      };
    if (matches(value, ["privacy", "store", "save", "data", "tracking"]))
      return {
        role: "companion",
        text: "This conversation stays in this browser tab and disappears when the page reloads. I do not send the text to a server, create a profile, or keep a secret diary about you.",
      };
    if (
      matches(value, [
        "help",
        "what can you do",
        "command",
        "how does this work",
      ])
    )
      return {
        role: "companion",
        text: "Try “turn on light mode”, “take me to projects”, “where can I learn caching?”, “what does Denta build?”, or “pick a game”. I can also find any named Next.js chapter or Playground tool.",
        actions: [
          { label: "Browse docs", href: "/docs" },
          { label: "Browse Playground", href: "/playground" },
        ],
      };

    return {
      role: "companion",
      text: "I’m a small local guide, not an all-knowing space oracle. Ask me about this portfolio, Denta’s public work, Next.js docs, Playground tools, navigation, or the site theme.",
      actions: [{ label: "Browse the site", href: "/" }],
    };
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    setInput("");
    setMessages((current) => [
      ...current,
      { role: "visitor", text: question },
      answer(question),
    ]);
  }

  return (
    <div
      className={`portfolio-companion ${open ? "is-open" : ""} ${petAnimation}`}
    >
      {nudge && !open && (
        <button className="companion-nudge" type="button" onClick={petMizu}>
          <Heart /> Pet me…
        </button>
      )}
      {menuOpen && !open && (
        <div
          className="companion-pet-menu"
          role="menu"
          aria-label="Mizu actions"
        >
          <button type="button" onClick={petMizu} role="menuitem">
            <Sparkles /> Pet Mizu
          </button>
          <button type="button" onClick={openChat} role="menuitem">
            <MessageCircle /> Open chat
          </button>
        </div>
      )}
      {open && (
        <section
          className="companion-panel"
          role="dialog"
          aria-label="Mizu portfolio companion"
        >
          <header>
            <div>
              <span>Mizu / local guide</span>
              <strong>Ask this little orbit brain</strong>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close companion"
            >
              <X />
            </button>
          </header>
          <div className="companion-privacy">
            <Lightbulb />
            <p>
              <strong>Private by being forgetful.</strong> This chat stays in
              this tab and is never sent to a server.
            </p>
          </div>
          <div className="companion-log" ref={logRef} aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`companion-message is-${message.role}`}
                key={`${message.role}-${index}`}
              >
                <p>{message.text}</p>
                {message.actions && (
                  <div>
                    {message.actions.map((action) => (
                      <button
                        type="button"
                        onClick={() => runAction(action)}
                        key={action.label}
                      >
                        {action.command === "dark" ? (
                          <Moon />
                        ) : action.command === "light" ? (
                          <Sun />
                        ) : action.href?.startsWith("/docs") ? (
                          <BookOpen />
                        ) : action.href?.startsWith("/playground") ? (
                          <Gamepad2 />
                        ) : (
                          <ArrowRight />
                        )}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={submit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about the site…"
              aria-label="Message Mizu"
            />
            <button type="submit" aria-label="Send message">
              <Send />
            </button>
          </form>
        </section>
      )}
      <button
        className="companion-creature"
        type="button"
        onClick={() => {
          if (open) setOpen(false);
          else setMenuOpen((current) => !current);
          setNudge(false);
        }}
        aria-label={open ? "Close Mizu chat" : "Open Mizu actions"}
        aria-expanded={open || menuOpen}
      >
        <span className="creature-shadow" />
        <span className="creature-tail" />
        <span className="creature-body">
          <i />
        </span>
        <span className="creature-head">
          <i className="creature-ear left" />
          <i className="creature-ear right" />
          <i className="creature-eye left" />
          <i className="creature-eye right" />
          <i className="creature-mouth" />
        </span>
        <span className="creature-signal">
          <i />
          <i />
          <i />
        </span>
      </button>
    </div>
  );
}
