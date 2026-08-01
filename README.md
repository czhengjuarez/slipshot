# Slipshot

The [Slipshot](https://slipshot.io) book series website, rebuilt from scratch on Next.js + Cloudflare Workers to replace the old Webflow site. Public marketing pages (home, characters, novels, art, conventions, blog, contact) plus a lightweight admin CMS for managing content without a code deploy.

**Live preview:** https://slipshot.coscient.workers.dev
**Production domain (not yet cut over):** slipshot.io

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **[OpenNext for Cloudflare](https://opennext.js.org/cloudflare)** — adapts the Next.js build to run on Cloudflare Workers
- **Cloudflare D1** (SQLite) via **Drizzle ORM** — all structured content
- **Cloudflare R2** — all media (images, video)
- **Wrangler** — local dev, D1/R2 management, deploys

No separate API layer: pages read from D1 directly (`getDb()` from `src/db`), and the admin writes via Server Actions straight to D1 + R2 (`src/lib/media.ts` for uploads).

## Getting started

```bash
npm install
npm run dev          # Next.js dev server at localhost:3000, reads local D1
```

Local D1/R2 state lives in `.wrangler/state` and is separate from remote. To seed or inspect local data:

```bash
npx wrangler d1 execute slipshot-db --local --command "SELECT * FROM characters"
npx wrangler d1 execute slipshot-db --remote --command "SELECT * FROM characters"   # production data
```

### Deploying

```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

(`npm run deploy` does both in one step.) Deploys go to the Worker named `slipshot`, currently only reachable at the `*.workers.dev` preview URL above — no custom domain is wired up yet.

## Content model

Everything lives in D1, defined in `src/db/schema.ts`:

| Table | Notes |
|---|---|
| `characters` + `character_sections` | Bio, accent color, quote, thumbnail/hero art, plus freeform story sections per character |
| `books` | 3 published volumes, cover art, buy links (Amazon/Bookshop/B&N) |
| `blog_posts` | "The Slip-Log" — Markdown body, category, cover image |
| `art_pieces` | Gallery items — category (Character Art / Key Art / Sketch), `public`/`exclusive` visibility |
| `conventions` | Appearance schedule — list + calendar view on `/conventions` |
| `subscribers` | Newsletter signups from the "Join the Insider List" forms |

Media is stored in R2 under prefixed keys (`characters/`, `books/`, `blog/`, `art/`, `home/`, `vibe/`, `codex/`, `hero/`, `unlock/`) and served through `/media/[...key]` (`src/app/media/[...key]/route.ts`), a proxy route in front of the R2 bucket. `mediaUrl(key)` in `src/lib/media.ts` turns a stored key into that URL.

## What's been done

- **Full site rebuild** on Next.js/Cloudflare, styled from the Slipshot design system (`src/styles/tokens.css` + `components.css`)
- **Admin CMS** (`/admin`) — CRUD for characters (+ story sections), books, blog posts, art, conventions; image upload straight to R2
- **Real content migrated** from the live Webflow site: all 13 characters, all 3 book volumes, all 17 blog posts, and 33 art pieces (character art, key art, sketches — sourced from the studio's Drive/Downloads folders, not just the live site)
- **New pages not on the old site**: `/the-vibe` (the four story "classifications" — Violence/Peace/Manipulation/Pathos — sourced from the Codex art book, with scroll-triggered reveal animation) and `/unlock` (replica of the hidden audiobook-access page, still pointed at the existing external `slipshot-downloads` Worker for code validation and file delivery)
- **Home page** rebuilt with: video hero, Griddish/Vars story banner, 5-character story-overlay section, auto-scrolling "Meet the Cast" carousel (all 13 characters), "Get the Novels" (intro + per-volume column + Codex trailer video), Slip-Log teaser, and a footer-embedded signup form

## What's left to do

- **Cloudflare Access** in front of `/admin*` — right now the admin is unauthenticated and open to anyone who finds the URL. This is a Cloudflare dashboard step (Zero Trust → Access → Applications), not code.
- **Custom domain cutover** — point `slipshot.io` at this Worker and retire the Webflow site. Deliberately not done yet; needs explicit go-ahead since it's a live DNS change.
- **`/unlock` backend migration** — still calls the old `slipshot-downloads.black-unit-15bd.workers.dev` Worker and its own R2 bucket for code validation and audiobook files. Fine as-is, but should eventually move into this project.
- **Missing help pages** — `/unlock` links to `/audio-access-help` and `/audio-access-guide`, neither of which exist here yet (still pointing at the old site's copy conceptually).
- **Art asset backlog** — the ~300-file studio art archive (mostly PSDs) hasn't been fully mined; what's live now is a curated first pass (33 pieces).
- **Codex ordering** — the "Explore the Series" section shows the Codex 1.0 art book alongside the novels but has no purchase/order flow yet.
- Three character story sections (Rive Amber, Jeremiah Onu, Natty Mick) contain a flagged paraphrase instead of verbatim original text — noted inline in the DB, fixable via the admin edit UI.
