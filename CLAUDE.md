# Project Instructions

## Package Manager

This project uses **Bun** (v1.3.10). Use `bun` for all package management and script running — not `npm`, `yarn`, or `npx`.

## Common Commands

| Task | Command |
|------|---------|
| Install dependencies | `bun install` |
| Dev server | `bun dev` |
| Production build | `bun run build` |
| Serve production build | `bun run serve` |
| Lint (with auto-fix) | `bun run lint` |
| Bundle analysis | `bun run analyze` |

## Notes

- The build script runs `bun ./scripts/postbuild.mjs` after Next.js compiles — this generates the RSS feed and search index.
- `bun run analyze` sets `ANALYZE=true` and opens the webpack bundle analyzer (no `cross-env` needed — Bun handles inline env vars natively).
- The lockfile is `bun.lock` (text format). Commit it alongside `package.json` changes.
