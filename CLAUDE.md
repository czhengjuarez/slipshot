# CLAUDE.md

Guidance for AI agents working in this repo. Read `README.md` first for project/architecture context — this file is about *how to work here*, not what the project is.

## Core workflow: every change touching data or media needs local + remote

D1 and R2 each have a **local** copy (`.wrangler/state`, used by `npm run dev`) and a **remote** copy (production, what the deployed Worker reads). They are separate — writing to one does not touch the other. Any time you seed/update D1 or upload to R2, do it twice:

```bash
npx wrangler d1 execute slipshot-db --local  --command "..."   # or --file
npx wrangler d1 execute slipshot-db --remote --command "..."

npx wrangler r2 object put "slipshot-media/<key>" --file <path> --content-type <type> --local
npx wrangler r2 object put "slipshot-media/<key>" --file <path> --content-type <type> --remote
```

Always use `npx wrangler`, not bare `wrangler` — it's a devDependency, not a global install.

## Code change → deploy loop

1. Edit code
2. `npm run build` (plain Next.js build — fast, catches TypeScript errors before you bother with the Cloudflare build)
3. Restart dev server if you need to eyeball it: `lsof -ti:3000 | xargs kill -9; npm run dev &`
4. `npx opennextjs-cloudflare build && npx wrangler deploy`
5. Verify against the deployed URL, not just localhost — the Cloudflare build step (asset bundling, edge runtime shims) can surface issues that `next build` alone doesn't.

Commit before or after deploying (whichever fits the change), but don't skip the deploy — this project has no CI/CD wired up, so "done" means "live at the workers.dev URL," not just "committed."

## Known gotchas

- **The `/` route caches at the edge for a year** (`Cache-Control: s-maxage=31536000` — Next.js's own header for static pages, not something we set). Right after a deploy, the *first* fetch of `/` from a script can return the stale pre-deploy version even though the deploy succeeded. Don't panic and don't "fix" anything — just fetch again; the second request typically shows `x-nextjs-cache: MISS` with fresh content. Other dynamic routes don't have this issue.
- **Grepping fetched HTML often double-counts.** Next.js embeds a serialized RSC payload later in the same HTML response, which duplicates class names and text strings that only appear once visually. If a `grep -c` count looks like exactly 2x (or 4x) what you expected, that's why — not a real duplicate element. Confirm visually or with a more targeted extraction instead of trusting raw counts.
- **This shell's zsh breaks on `for`/`while` loops with arrays** ("command not found" on the loop body). Use a Python script for iteration, or generate a standalone `.sh` file with explicit repeated commands and run it with `bash file.sh`.
- **PDF/large-file downloads via the Google Drive MCP tool fail silently past a few MB** (base64 encoding blows the context/output limit — usually manifests as a transient "fetch failed" or a truncation error). For anything bigger, ask the user to download it into `~/Downloads` or `~/Desktop` and read it from disk instead.
- **`poppler` (`pdftoppm`) and `ffmpeg` aren't preinstalled** — `brew install poppler` / `brew install ffmpeg` if you need to rasterize PDF pages or transcode video. Both were needed for the art-book and codex-video work.

## Design system conventions

- Tokens and component classes live in `src/styles/tokens.css` and `src/styles/components.css` — check there before inventing a new class or inline style. Buttons: `.btn-primary` (solid), `.btn-ghost` (outline, "secondary"), `.btn-white`, `.btn-violet`.
- Full-bleed image sections that pair a background image with overlaid text (hero, story banners, character-story rows, Vibe classification cards) universally use `object-position: top` or `background-position: top` — character art in this project is composed with the subject near the top of frame, and default center-cropping cuts heads off. Match that pattern for new sections rather than defaulting to `center`.
- `mediaUrl(key)` (from `@/lib/media`) is the only way page code should reference R2 assets — never hardcode a `/media/...` path by hand.

## Content provenance

Most page copy (character bios, blog posts, book summaries, the Vibe page's classification quotes) is verbatim content migrated from the site owner's own live site or source documents (the Webflow site, the "Codex 1.0: Slipshot" art book/companion PDF), done at their explicit direction as part of this rebuild. If you're asked to pull more content from those sources, that's expected and fine — it's the same site owner's own material, not third-party content. Original UI copy (nav labels, button text, section descriptions not sourced from those documents) should stay original when you're writing something new rather than migrating.
