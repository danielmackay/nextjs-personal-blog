---
name: diagram-images
description: "Generate brand-consistent HTML-based diagram images (light + dark variants) for Dan Does Code blog posts. Use this whenever a blog post would benefit from an inline diagram, illustration, flowchart, sequence, comparison stack, or any custom visual that isn't a screenshot or photo. Trigger on phrases like 'add a diagram', 'visualize this', 'illustrate the flow', 'add a chart', 'add an image showing X', 'create a figure for', 'render that as a diagram', 'make this a visual', or any request to add a visual artefact to an .mdx post in data/blog/. Also use proactively when drafting a blog post that explains a multi-step process, a hierarchy, a comparison, or a flow — those are exactly the moments a diagram lifts comprehension. The output is a pair of transparent PNGs (light + dark) plus the MDX figure markup that swaps them via Tailwind dark mode classes. Do NOT use for mermaid blocks the user wants to keep as code, for screenshots of running apps, or for photos / banner images."
author: Daniel Mackay
---

# Diagram images for the Dan Does Code blog

You are generating brand-consistent inline diagrams for blog posts in this repo. The diagrams are HTML rendered to transparent PNGs at high resolution, then inserted as theme-aware `<figure>` tags in the post's MDX.

## The end-to-end workflow

Five steps, in order. The bundled `scripts/render.sh` and the two starter templates do most of the heavy lifting.

### 1. Pick (or invent) a template

Two archetypes ship with this skill:

| Template                                | Best for                                              |
|-----------------------------------------|-------------------------------------------------------|
| `templates/numbered-list.html`          | Ordered hierarchies, prioritised lists, layered stacks (e.g. "5 layers of config precedence", "3 levels of caching"). Each row is a numbered circle + title + description. Some rows can be "weak" (soft circles) and others "strong" (filled circles). |
| `templates/horizontal-flow.html`        | Parallel flows / pipelines / process steps shown side-by-side as stacked cards. Each card: header + horizontal `[source] → [orchestrator] → [target]` flow with mechanism labels on arrows. Optional unifying band underneath summarising the shared outcome. |

If neither archetype fits, **invent a new template from scratch** but reuse the brand tokens (see `references/brand-tokens.md`). The two existing templates are starting points, not constraints. Don't force-fit a diagram into the wrong shape.

### 2. Copy the template and edit the content

```bash
# Use the post slug + a diagram name as the working filename.
cp .claude/skills/diagram-images/templates/numbered-list.html \
   /tmp/<post-slug>-<diagram-name>.html
```

Then edit `/tmp/<post-slug>-<diagram-name>.html`:
- Replace the placeholder rows / cards with your real content.
- Keep the inline `<style>` block exactly as-is — the brand tokens, light/dark variant switching, and sizing are all tuned.
- Add or remove rows/cards as needed.

Both templates support **light + dark themes from one file** via a `?theme=` URL query param. The `<script>` in the head reads it and sets `<html data-theme="...">`; the CSS uses `:root[data-theme="dark"]` overrides. You edit content once, render twice.

### 3. Render both variants to PNG

```bash
SCRIPT=.claude/skills/diagram-images/scripts/render.sh
OUT=public/static/images/<post-slug>
mkdir -p "$OUT"

# Light variant
"$SCRIPT" /tmp/<post-slug>-<diagram-name>.html \
  "$OUT/<diagram-name>-light.png" light 1500 900

# Dark variant
"$SCRIPT" /tmp/<post-slug>-<diagram-name>.html \
  "$OUT/<diagram-name>-dark.png" dark 1500 900
```

The script invokes Chrome headless with `--default-background-color=00000000` to produce a true alpha-channel PNG (no white panel, no off-white card behind the content). The body in both templates has `background: transparent`.

**Tuning the height:** after rendering, check the PNG and look for excess bottom whitespace. Re-render with a smaller `height` value until the content fills the frame. Typical heights:
- Short numbered list (5 rows): ~830px
- Short horizontal flow (3 cards): ~720px

Don't undershoot — content cut off is worse than a bit of whitespace.

### 4. Insert into the MDX post

In the post (`data/blog/<post-slug>.mdx`), drop a `<figure>` with **both images** and Tailwind dark-mode classes:

```mdx
<figure>
  <img src="/static/images/<post-slug>/<diagram-name>-light.png"
       alt="<descriptive alt text>"
       className="block dark:hidden" />
  <img src="/static/images/<post-slug>/<diagram-name>-dark.png"
       alt="<descriptive alt text>"
       className="hidden dark:block" />
  <figcaption>Figure: <one-line caption>.</figcaption>
</figure>
```

- `className` (not `class`) — MDX is JSX-flavoured.
- Both images load on every visit; CSS hides one. Browsers cache aggressively, so the second-image cost is negligible.
- The alt text must describe the content, not just the layout, so it's still informative when read aloud.
- A `<figcaption>` is optional but recommended for context.

### 5. Verify in browser

Start the dev server if it isn't already running (`bun dev`) and visit `http://localhost:3000/blog/<post-slug>`. Toggle the dark-mode switch in the navbar. Both variants should display crisply with no rendering glitches.

## Why this matters — the gotchas baked into the templates

These are the lessons that took several iterations to learn. The templates already handle them; understand them before improvising.

**Text sizes in source are bigger than they "look right".** The blog scales 1400px source images down to a ~768px column (≈55%). A `16px` source font becomes ~9px on screen. The templates use `22–32px` for body copy and `26–34px` for titles so the rendered text lands at readable sizes. If you invent a new template, see the sizing table in `references/brand-tokens.md`.

**Transparent PNGs need `--default-background-color=00000000` on the chrome command.** Otherwise Chrome composites the page over white, and your "transparent" PNG is actually white. The bundled `render.sh` handles this.

**Render at 2× device pixel ratio for retina sharpness.** Without `--force-device-scale-factor=2` the PNG comes out at 1× DPI, and the browser then upscales each pixel on retina screens — text and lines read as visibly soft / blurry. The bundled `render.sh` defaults to dpr=2 so the output PNG is twice the viewport's CSS pixel dimensions (a 1500×900 viewport → 3000×1800 PNG). File size triples but the image stays crisp on every display. If invoking chrome directly, include the flag.

**Crop SVG viewBoxes tightly to content.** If a diagram has built-in side margin, two things might be causing it: CSS body padding *and* SVG viewBox slack. Set `body { padding: 0 }` and change the viewBox to start at the content's leftmost x and span only as wide as the content needs (e.g. `viewBox="240 0 744 720"` to crop 240px of empty canvas off the left). Coordinates don't need to move — viewBox is a window, not a constraint.

**Use `file://` URLs in the render command.** Chrome headless reads local files directly — no dev server, no `cp` to `public/` dance. The script does this automatically.

**Light + dark variants are non-negotiable for this blog.** It uses `next-themes` with `attribute="class"`, so SVG `prefers-color-scheme` won't follow the theme. The only reliable swap is two PNGs + Tailwind `dark:hidden` / `dark:block`. Don't try to ship one image — dark text on a dark page bg is unreadable, and a white-bg panel looks like a stark rectangle on dark.

**Vertical stacks beat horizontal grids for narrow columns.** A 3-card grid at 1500px source becomes 3 × ~250px cells at display — too cramped. Stacking the same 3 cards vertically (each full-width) keeps text large enough to read after downscale. The `horizontal-flow.html` template stacks vertically for this reason.

**Stark white card backgrounds break in dark mode.** Even if you set the body bg transparent, a `.card { background: #F8FAFC }` rectangle still pops against the dark page bg. Use transparent card backgrounds with subtle 1px borders instead. Both templates do this.

## When the templates aren't enough

Sometimes the diagram you need is something else entirely — a circular flow, a quadrant chart, a swimlane, a Venn-style overlap. Invent a new HTML template:

1. Read `references/brand-tokens.md` for the palette and sizing rules.
2. Use Space Grotesk + JetBrains Mono via the Google Fonts link in the existing templates.
3. Include the same `<script>` that reads `?theme=` and sets `data-theme`.
4. Define light tokens under `:root {}` and dark overrides under `:root[data-theme="dark"] {}`.
5. Set `body { width: 1400px; padding: 12px; background: transparent; }`.
6. Render with `render.sh` the same way.

Save invented templates to `.claude/skills/diagram-images/templates/` so future posts can reuse them.

## Quick decision rules

- **More than 2-3 sentences of prose to explain a sequence/hierarchy/comparison?** A diagram will land better. Offer one proactively.
- **Showing a flow (X → Y → Z)?** `horizontal-flow.html`.
- **Showing a stack / list / priority order?** `numbered-list.html`.
- **Showing both at once?** Probably two diagrams — don't cram into one.
- **Just illustrating a single concept?** A static screenshot of the running thing usually beats a diagram. Skip the skill.

## Cleanup

After the rendered PNGs are in `public/static/images/<post-slug>/`, you can delete the working HTML in `/tmp/` — it served its purpose. The template in `.claude/skills/diagram-images/templates/` is untouched.
