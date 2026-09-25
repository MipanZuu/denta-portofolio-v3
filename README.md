# Denta Bramasta — Portfolio

The source code for [dentabramasta.com](https://www.dentabramasta.com), my personal portfolio and interactive web playground.

This is more than a collection of project cards. The website combines a space-inspired visual system, liquid-glass surfaces, interactive 3D scenes, long-form engineering documentation, small browser tools, games, and a private portfolio companion named Mizu.

## Highlights

- Interactive landing page with 3D orbital navigation and responsive motion
- Scroll-driven Journey experience with layered planets and spatial depth
- Project, experience, technology, blog, and contact pages
- Structured Next.js learning guide with chapter navigation and reading mode
- Browser-only Playground tools and games
- Mizu, a local portfolio guide with typo-tolerant commands, navigation, theme controls, and pet animations
- Light and dark themes with persistent preference
- Custom route transitions, global planet field, and responsive liquid-glass UI
- Dynamic blog studio backed by Neon, Drizzle ORM, and Vercel Blob
- Metadata, canonical URLs, JSON-LD, sitemap, and robots configuration for public routes

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Three.js for interactive 3D scenes
- Tailwind CSS/PostCSS and custom CSS
- Neon Postgres and Drizzle ORM
- Neon Auth
- Vercel Blob and Vercel Analytics
- Spotify integration for the current-mood component

## Running locally

Requirements:

- Node.js compatible with Next.js 16
- pnpm 10

Install dependencies and copy the environment template:

```bash
pnpm install
cp .env.example .env.local
```

Add the services you intend to use to `.env.local`, then start development:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The public portfolio can render without every optional integration, but authentication, blog management, uploads, and Spotify features require their corresponding environment variables.

## Environment variables

The complete template is available in [`.env.example`](./.env.example). It includes configuration for:

- Canonical production URL
- Neon Postgres
- Neon Auth
- Vercel Blob
- Spotify OAuth

Never commit `.env.local` or production credentials.

### Dashboard security

The dashboard uses Neon Auth's secure session cookies and refresh-aware Next.js proxy. Authentication is only the first gate: every dashboard layout, mutation, upload, and private integration also checks the server-side admin allow-list.

For production, set `PORTFOLIO_ADMIN_USER_IDS` to the immutable Neon Auth user ID that owns the dashboard. `PORTFOLIO_ADMIN_EMAILS` is available as a setup/migration fallback. Public registration is disabled by default; temporarily set `AUTH_ALLOW_ADMIN_SIGN_UP=true` only while creating the initial owner account, then disable it again.

## Useful commands

```bash
pnpm dev          # Start the development server
pnpm lint         # Run ESLint
pnpm exec tsc --noEmit
pnpm commit       # Create a guided Conventional Commit
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Apply database migrations
pnpm db:studio    # Open Drizzle Studio
pnpm build        # Migrate the database and create a production build
pnpm start        # Run the production build
```

## Commit convention

Run `pnpm commit` instead of composing a commit message manually. Commitizen will guide you through a [Conventional Commits](https://www.conventionalcommits.org/) message (`feat`, `fix`, `docs`, `refactor`, and so on), starting directly with the short description after selecting a type. It also supports breaking changes and issue references without asking for a scope. This keeps the history readable and ready for automated changelogs.

## Project structure

```text
app/          Routes, layouts, metadata, sitemap, robots, and API handlers
components/   Page sections, 3D experiences, UI, docs, games, and tools
db/           Drizzle database client and schema
lib/          Auth, blog, and Spotify server logic
public/       Public images, fonts, documents, and technology artwork
statics/      Portfolio content, navigation, SEO data, and documentation
drizzle/      Generated database migrations
```

Public routes are included in the generated sitemap. Authentication, dashboard, API, document-proxy, and private media routes are deliberately excluded from indexing.

## Reference and usage

You are welcome to explore this repository to learn from its architecture, interaction ideas, accessibility decisions, and implementation patterns. You may use small, independently adapted ideas as reference in your own work with attribution where appropriate.

Please do not:

- Copy and publish the website or substantial portions of its source code
- Reproduce its visual identity, layouts, Mizu character, writing, or 3D experiences as a portfolio template
- Remove copyright notices or present this work as your own
- Redistribute, sell, sublicense, or create a near-identical derivative of the project
- Reuse personal content, images, branding, project material, or private configuration

In short: learn from it, but do not clone it. If you would like permission for a use not covered here, contact me through the website.

## Copyright

Copyright © 2026 Denta Bramasta Hidayat. All rights reserved.

This repository is provided for viewing and educational reference only. It is **not open source**. See [`LICENSE`](./LICENSE) for the complete terms.
