# Brand tokens reference

Use these tokens when **inventing a new diagram template** that isn't covered by `numbered-list.html` or `horizontal-flow.html`. The two bundled templates already inline the right values.

Tokens come from the Dan Does Code brand (sourced from dandoescode.com) and are designed to pass WCAG AA on each mode's background.

## Light mode (default)

```css
:root {
  --text:              #111827;  /* primary body text (16.1:1 on white, AAA) */
  --text-2:            #374151;  /* secondary text  (9.6:1 on white, AAA) */
  --primary:           #0EA5E9;  /* brand sky-blue — large text / decorative only on white */
  --primary-strong:    #0284C7;  /* body-link-safe sky-blue (4.86:1 on white, AA) */
  --primary-soft:      #E0F2FE;  /* sky-100 — soft circle/chip bg */
  --primary-soft-text: #0369A1;  /* sky-700 — text on soft sky chips */
  --accent:            #EC4899;  /* pink — inline <code>, badges, single-element emphasis */
  --accent-soft:       #FCE7F3;  /* pink-100 — chip bg for inline code */
  --ui:                #E5E7EB;  /* borders, dividers, subtle surfaces */
  --mono-bg:           #F1F5F9;  /* mono-pill background (file paths, identifiers) */
  --node-border:       #BAE6FD;  /* sky-200 — diagram node outlines */
}
```

## Dark mode (override on `[data-theme="dark"]`)

```css
:root[data-theme="dark"] {
  --text:              #F3F4F6;  /* (~17:1 on #030712, AAA) */
  --text-2:            #D1D5DB;  /* (~13:1 on #030712, AAA) */
  --primary:           #38BDF8;  /* lighter sky for dark bg (9:1, AAA) */
  --primary-strong:    #0EA5E9;  /* solid fills (circles, hot nodes, unifying bands) */
  --primary-soft:      #0C4A6E;  /* sky-900 — soft circle bg */
  --primary-soft-text: #7DD3FC;  /* sky-300 — text on soft sky chips */
  --accent:            #F472B6;  /* lighter pink for dark bg */
  --accent-soft:       #831843;  /* pink-900 — chip bg for inline code on dark */
  --ui:                #1F2937;  /* borders, dividers, subtle surfaces */
  --mono-bg:           #1F2937;  /* mono-pill background */
  --node-border:       #0369A1;  /* sky-700 — node outlines visible on dark */
}
```

## Fonts

```css
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;       /* display + body */
font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;       /* code */
```

Load via Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
```

## Sizing — why source text is bigger than it looks

The blog renders post images into a `~768px` content column. The source PNG is rendered at `1400px` wide and downscales to roughly **55%**. Source text at `18px` ends up at ~10px on screen — too small.

Bump source text to the equivalent of "looks too big" at 1400px so it lands at the right size after downscale:

| Element                  | Source size | Rendered (~55%) |
|--------------------------|-------------|-----------------|
| Row title                | 26–32px     | 14–18px         |
| Body / description       | 22–24px     | 12–14px         |
| Inline mono / code       | 17–22px     | 9–12px          |
| Number circle (font)     | 28–34px     | 15–18px         |
| Number circle (diameter) | 56–80px     | 30–44px         |
| Chip / pill              | 16–26px     | 9–14px          |
| Unifying band copy       | 22–24px     | 12–14px         |

If a diagram is wider than usual (>1500px source) the downscale ratio gets harsher. Counter-bump text another 10–20% per 200px over.

## Spacing — why narrow columns favour vertical stacks

Three cards side-by-side at 1400px → each card is ~460px → fine. After 55% downscale → each card is ~253px → cramped. **Stack vertically** for narrow-column rendering. Each card gets the full 1400px and downscales to ~770px, plenty of room.

If you build a layout with horizontal cells, ask: at 55% scale, does each cell hold its content without wrapping awkwardly? If not, stack.

## What the diagram should *not* have

- No solid card backgrounds (`#F8FAFC` light grey panels). They render as stark white rectangles in dark mode.
- No outer panel with `border-radius` and `padding` wrapping the whole diagram. Body padding is enough.
- No drop shadows. They look heavy after downscale and don't render consistently across modes.
- No emoji icons unless they're load-bearing meaning (not decoration). The brand voice uses emoji sparingly.
- No fixed pixel sizes on inner cards that force horizontal-only layouts at narrow widths.
