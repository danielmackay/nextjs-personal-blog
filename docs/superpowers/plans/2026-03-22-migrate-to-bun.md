# Migrate to Bun Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Yarn Berry (v3.6.1) with Bun (v1.3.10) as the package manager and script runner for the Next.js personal blog.

**Architecture:** Remove all Yarn-specific configuration files and lockfile, update `package.json` to use Bun conventions (`packageManager`, `overrides` instead of `resolutions`, and Bun-native env var syntax), then run `bun install` to generate the Bun lockfile. No application code changes are required — Bun is Node.js-compatible and Next.js runs on Bun without modification.

**Tech Stack:** Bun 1.3.10, Next.js 15, TypeScript, contentlayer2

---

## File Map

| File | Action | Reason |
|------|--------|--------|
| `package.json` | Modify | Update `packageManager`, scripts, replace `resolutions` → `overrides`, remove `cross-env` |
| `.gitignore` | Modify | Remove Yarn-specific ignore rules, add Bun lockfile entries |
| `.yarnrc.yml` | Delete | Yarn Berry config — not used by Bun |
| `.yarn/` | Delete | Contains Yarn Berry releases and cache |
| `yarn.lock` | Delete | Replace with `bun.lockb` |
| `bun.lockb` | Create (via `bun install`) | Bun's binary lockfile |

---

## Task 1: Update `package.json`

**Files:**
- Modify: `package.json`

The five changes are:
1. `"packageManager"` → `"bun@1.3.10"`
2. `"build"` script: `node ./scripts/postbuild.mjs` → `bun ./scripts/postbuild.mjs`
3. `"analyze"` script: `cross-env ANALYZE=true next build` → `ANALYZE=true next build` (Bun supports inline env vars natively)
4. `"resolutions"` → `"overrides"` (Bun's package resolution field; Yarn's `resolutions` key is not recognized by Bun)
5. Remove `"cross-env"` from `devDependencies` (no longer needed)

- [ ] **Step 1: Update `packageManager` field**

In `package.json`, change:
```json
"packageManager": "yarn@3.6.1"
```
To:
```json
"packageManager": "bun@1.3.10"
```

- [ ] **Step 2: Update the `build` and `analyze` scripts**

In `package.json` `"scripts"`, change:
```json
"build": "next build && node ./scripts/postbuild.mjs",
"analyze": "cross-env ANALYZE=true next build",
```
To:
```json
"build": "next build && bun ./scripts/postbuild.mjs",
"analyze": "ANALYZE=true next build",
```

- [ ] **Step 3: Rename `resolutions` to `overrides` and fix nested syntax**

Yarn uses `/`-separated paths for nested resolutions; npm/Bun `overrides` uses nested objects. Change the key `"resolutions"` to `"overrides"` and convert the `"next-contentlayer/next"` entry to npm nested syntax:

```json
"overrides": {
  "@opentelemetry/api": "1.4.1",
  "@opentelemetry/core": "1.13.0",
  "@opentelemetry/exporter-trace-otlp-grpc": "0.39.1",
  "@opentelemetry/resources": "1.13.0",
  "@opentelemetry/sdk-trace-base": "1.13.0",
  "@opentelemetry/sdk-trace-node": "1.13.0",
  "@opentelemetry/semantic-conventions": "1.13.0",
  "next-contentlayer2": {
    "next": "15.2.9"
  }
}
```

> ⚠️ The Yarn syntax `"next-contentlayer/next"` is invalid in Bun's `overrides`. The npm-style nested object `"next-contentlayer2": { "next": "15.2.9" }` is the correct equivalent. Note the package is `next-contentlayer2` (the fork), not `next-contentlayer`.

- [ ] **Step 4: Remove `cross-env` from `devDependencies`**

Delete this line from `"devDependencies"`:
```json
"cross-env": "^7.0.3",
```

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "chore: update package.json for Bun migration"
```

---

## Task 2: Update `.gitignore`

**Files:**
- Modify: `.gitignore`

The current `.gitignore` has Yarn Berry-specific entries. Replace them with Bun equivalents. Bun's binary lockfile (`bun.lockb`) should be committed (like `yarn.lock`).

- [ ] **Step 1: Replace Yarn ignore rules with Bun rules**

In `.gitignore`, replace:
```
# dependencies
/node_modules
/.pnp
.pnp.js
/.yarn/*
!/.yarn/releases
!/.yarn/plugins
!/.yarn/sdks
```
With:
```
# dependencies
/node_modules
/.pnp
.pnp.js
```

- [ ] **Step 2: Remove yarn debug log entries**

In `.gitignore`, remove:
```
yarn-debug.log*
yarn-error.log*
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: update .gitignore for Bun (remove Yarn Berry entries)"
```

---

## Task 3: Remove Yarn artifacts

**Files:**
- Delete: `.yarnrc.yml`
- Delete: `.yarn/` (entire folder — contains `releases/yarn-3.6.1.cjs`, `cache/`, `install-state.gz`)
- Delete: `yarn.lock`

> ⚠️ These deletes are destructive. Verify the previous tasks are committed before proceeding.

- [ ] **Step 1: Delete Yarn-specific files**

```bash
rm .yarnrc.yml
rm yarn.lock
rm -rf .yarn
```

- [ ] **Step 2: Verify the files are gone**

```bash
ls -la | grep yarn
```
Expected: no output.

- [ ] **Step 3: Commit the deletions**

```bash
git add -u
git commit -m "chore: remove Yarn Berry lockfile and config"
```

---

## Task 4: Install dependencies with Bun

**Files:**
- Create: `bun.lockb` (generated by `bun install`)

- [ ] **Step 1: Run `bun install`**

```bash
bun install
```
Expected output: Bun resolves all dependencies from `package.json`, installs into `node_modules/`, and generates `bun.lockb`.

If you see warnings about the `overrides` field not being recognized, the version of Bun is too old — update Bun with `bun upgrade`.

- [ ] **Step 2: Verify `bun.lockb` was created**

```bash
ls -la bun.lockb
```
Expected: a binary file, several KB or larger.

- [ ] **Step 3: Commit the lockfile**

```bash
git add bun.lockb
git commit -m "chore: add Bun lockfile (bun.lockb)"
```

---

## Task 5: Verify the build works

- [ ] **Step 1: Run the development server**

```bash
bun run dev
```
Expected: Next.js dev server starts on `http://localhost:3000`. No errors in the terminal.

Ctrl+C to stop.

- [ ] **Step 2: Run the production build**

```bash
bun run build
```
Expected: Next.js build completes successfully, then `bun ./scripts/postbuild.mjs` runs (generates RSS feed). No errors.

- [ ] **Step 3: Run linting**

```bash
bun run lint
```
Expected: ESLint runs, exits 0 (or reports only pre-existing lint issues, not new ones from the migration).

- [ ] **Step 4: Commit any fixes needed**

If any issues arose during verification, fix them and commit:
```bash
git add <affected files>
git commit -m "fix: resolve issues after Bun migration"
```

---

## Verification Checklist

After all tasks are complete, confirm:
- [ ] `yarn.lock`, `.yarn/`, `.yarnrc.yml` are gone from the repo
- [ ] `bun.lockb` is committed
- [ ] `package.json` has `"packageManager": "bun@1.3.10"` and `"overrides"` (not `"resolutions"`)
- [ ] `bun run dev` starts the dev server
- [ ] `bun run build` completes without errors
- [ ] `bun run lint` completes without errors

---

## Known Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `overrides` not resolving OpenTelemetry deps the same way as `resolutions` | Low | Bun supports `overrides`; test build output |
| Husky hooks fail with Bun | Very Low | `.husky/pre-commit` is fully commented out — no active hooks |
| `contentlayer2` native compilation issues | Low | Already works with the current Yarn setup; Bun uses same node_modules layout |
| `@svgr/webpack` or other webpack plugins break | Very Low | These are Next.js webpack plugins, not affected by package manager change |
| Husky `prepare` script runs on `bun install` | Very Low | Bun runs `prepare` lifecycle by default; Husky v8 will run `husky install`. The pre-commit hook is fully commented out so no hooks activate — this is safe to leave as-is |
| `packageManager` field and Corepack | Informational | The `"packageManager": "bun@1.3.10"` field is informational — Corepack does not manage Bun and will not intercept `bun` commands |
