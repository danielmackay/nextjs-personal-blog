# Design

Visual system for Dan Does Code. Source of truth is the compiled CSS of the live site (dandoescode.com) and Daniel's personal brand guidelines. The blog is a **brand** register: design serves the reading experience and Daniel's identity.

## Theme

Dual theme, following the system preference (`theme: 'system'`), with a manual toggle. A developer reads this on a bright laptop screen during the workday and on a phone in a dark room at night, so both modes are first-class, not an afterthought. Light mode is the anchor; dark mode is fully designed, not inverted.

Class-based dark mode (`darkMode: 'class'`).

## Color

Strategy: **Restrained.** Tinted neutrals carry the surface; sky blue is the single brand anchor, and pink is a rare accent for code and small badges. The calm palette is what lets the two accents mean something. Colours are the Tailwind `sky` (primary), `pink-500` (accent), and `gray` families.

### Light mode

| Role | Hex | Usage |
|---|---|---|
| Background | `#FFFFFF` | Main page background |
| Background Alt | `#F8FAFC` | Cards, blockquote backdrop, subtle surfaces |
| Text | `#111827` | Primary body text (16.1:1, AAA) |
| Text Secondary | `#374151` | Captions, de-emphasised text (9.6:1, AAA) |
| Primary | `#0EA5E9` | Headings, hero accents, large links (large-text only, 3.31:1) |
| Primary Strong | `#0284C7` | Body-text links (4.86:1, AA normal) |
| Accent | `#EC4899` | Inline code, small badges (large-text / decorative only on white) |
| UI Accents | `#E5E7EB` | Borders, dividers |

### Dark mode

| Role | Hex | Usage |
|---|---|---|
| Background | `#030712` | Main dark background (matches `theme-color`) |
| Background Alt | `#111827` | Cards, raised surfaces |
| Text | `#F3F4F6` | Primary body text (~17:1, AAA) |
| Text Secondary | `#D1D5DB` | De-emphasised text (~13:1, AAA) |
| Primary | `#38BDF8` | Brand blue, headings, links (~9:1, AAA) |
| Primary Strong | `#0EA5E9` | Hover / pressed link state |
| Accent | `#EC4899` | Inline code (4.69:1, AA normal) |
| UI Accents | `#1F2937` | Borders, dividers |

### Rules

- Body-text links: `#0284C7` (light) / `#38BDF8` (dark). Reserve the brighter `#0EA5E9` for headings and hero accents.
- Never place `#EC4899` as body text on white; pink is for inline code, badges, and decorative accents at large sizes only.
- Accent usage stays under ~10% of any surface.

## Typography

- **Display and body:** Space Grotesk (loaded as `--font-space-grotesk`), weights 300 to 700.
  - Stack: `"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Code / monospace:** system mono stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`).
- **Headings:** weight 700 to 800, tight tracking (`-0.025em`), tight line-height (1.05 to 1.15). Page titles run large (the Projects and Blog headers use display-scale H1s).
- **Body:** weight 400, line-height ~1.55 to 1.65.
- **Measure:** article body capped around 65 to 75ch (`prose` handles this).
- **Hierarchy:** scale and weight contrast of at least 1.25 between steps. H1 and H2 are bold with tight tracking; H3 steps down to weight 600.

## Layout

- Content-first, generously spaced. A centred column for long-form reading, a two-up card grid for Projects, a stacked feed for the blog list.
- Cards are used where they are the right affordance (project tiles, post previews) with full borders (`#E5E7EB` / `#1F2937`), never side-stripe accents, never nested.
- Vary vertical rhythm between sections; avoid uniform padding everywhere.
- Header: wordmark left ("DAN DOES" charcoal, "CODE" sky blue), nav plus search plus theme toggle right.

## Motion

- Subtle and purposeful only. Theme transitions, hover states, link underlines.
- Ease-out curves (quart / quint / expo). No bounce, no elastic.
- Never animate layout properties. Respect `prefers-reduced-motion`.

## Components

- **Links:** underline or colour shift on hover, AA-safe colour, visible focus ring (`#0EA5E9` 2px outline, 2px offset).
- **Inline code:** pink (`#EC4899`) on a subtle UI-tinted background.
- **Code blocks:** dark surface (`gray-900`) in both themes for consistent syntax reading.
- **Project / post cards:** full border, heading + short description + a single "Learn more →" link. Same structure, sized by the grid, no icon-grid sameness.
- **Wordmark:** horizontal "DAN DOES CODE" lockup; pick the light or dark SVG by background, size by height, never recolour or add shadow.

## Anti-patterns (do not ship)

- Side-stripe borders, gradient text, decorative glassmorphism.
- Ad-style interruptions: popups, newsletter walls, engagement bait.
- Flashy motion or neon-on-black gimmicks.
- Generic SaaS-starter defaults that make the site look like the template it forked from.
