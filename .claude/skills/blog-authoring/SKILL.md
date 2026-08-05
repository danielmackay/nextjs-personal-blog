---
name: blog-authoring
description: "Use this skill whenever the user wants to create, edit, or draft a blog post (.mdx file) for the Dan Does Code blog. Triggers include: requests to write a new blog post, draft an article, create a tutorial, start a new series part, edit existing post content, fix blog post formatting, or any task involving MDX content in data/blog/. Also use when the user mentions 'blog post', 'article', 'tutorial', 'write about', or references creating content about .NET, Azure, software architecture, or developer tooling topics. If the user wants to create or modify any .mdx file in this project, use this skill."
disable-model-invocation: true
author: Daniel Mackay
---

# Blog Authoring for Dan Does Code

You are helping write technical blog posts for dandoescode.com -- a personal tech blog focused on .NET, Azure, software architecture, and developer productivity. The blog has a distinctive voice: personal, opinionated, and technically rigorous without being dry.

## Voice and Tone

**Invoke the `daniels-voice` skill for all voice and tone guidance.** That skill captures the specific patterns lifted from Daniel's pre-2023 blog posts — openers, rhetorical questions, opinion phrasing, emoji conventions, sentence rhythm, anti-patterns. This skill (`blog-authoring`) owns the *structural* conventions (frontmatter, sections, MDX components, image paths). `daniels-voice` owns *how the prose actually sounds*.

The two skills compose: trigger `daniels-voice` before drafting, then this skill for layout, then the `humanizer` skill after drafting to strip any residual AI tells. Drafting in Daniel's voice from the start is much more effective than trying to retrofit voice into neutral prose.

At a glance, the blog reads like a senior developer sharing hard-won lessons with a colleague over coffee — first person throughout, honest about trade-offs, technically precise but approachable, emojis used sparingly as punctuation rather than decoration. But `daniels-voice` has the specific patterns and real examples; consult it rather than relying on this summary.

## Post Structure

Every post follows this skeleton. Some sections are mandatory; others depend on the content type.

### Frontmatter

```yaml
---
title: "Descriptive Title - Be Specific About What the Reader Will Learn"
date: "YYYY-MM-DD"
tags: ["dotnet", "azure", "specific-tech"] # kebab-case, 3-6 tags, focus on searchable terms
draft: true # set to false only when ready for publication
summary: "Compelling 1-2 sentence summary highlighting the practical value for the reader"
images: ["/static/images/[slug]/banner.png"]
layout: PostLayout
---
```

Key rules:

- `title` and `date` are required by the contentlayer schema. Always include all fields above.
- Tags must be kebab-case. Prefer established tags from the existing post corpus: `dotnet`, `csharp`, `azure`, `clean-architecture`, `modular-monolith`, `devops`, `tooling`, `ai`, `vibe-coding`, `testing`, `bicep`, `ef-core`, `ddd`.
- Always set `draft: true` for new posts. The author decides when to publish.
- The `images` array should contain the banner image path. Use the post slug as the directory name under `/static/images/`.

### Body Structure

The body of every post follows this order:

```mdx
![Banner](/static/images/[slug]/banner.png)

<TOCInline toc={props.toc} exclude="Overview" toHeading={3} />

## Introduction

[Context -> Problem -> What we'll accomplish in this post]

## Prerequisites

[Tools, knowledge, accounts the reader needs -- use a bullet list]

## [Main Content Sections]

[The meat of the article, using numbered sections for tutorials]

## Summary

[Key takeaways, what the reader learned, and where to go next]

## Resources

[Links to official docs, repos, and related reading]
```

Important details:

- **Banner image**: Always use markdown syntax `![Banner](...)` directly after the frontmatter. Not the `<Image>` component.
- **TOCInline**: Include it right after the banner. Do NOT import it -- it's automatically available as a registered MDX component.
- **Introduction section**: Must be present. Follow the pattern: set the context, describe the problem or opportunity, then preview what the post covers.
- **Prerequisites section**: Include for tutorials and guides. Skip for opinion pieces or shorter articles.
- **Summary section**: Must be present. Wrap up with concrete takeaways.
- **Resources section**: Must be present. Link to official documentation, GitHub repos, and related posts on the blog.

### For Series Posts

Series posts live in subdirectories: `data/blog/[series-name]/part-one.mdx`, etc.

Each series has navigation components in `components/[series-name]/`:

- **SeriesHeader** -- Links to all parts in the series. Include right after the TOCInline.
- **SeriesResources** -- External reference links. Optional, usually placed near the Resources section.

These components are registered in `components/MDXComponents.tsx`. For a new series, the components need to be created and registered there.

Series post body structure:

```mdx
![Banner](/static/images/[series-name]/banner.png)

<TOCInline toc={props.toc} exclude="Overview" toHeading={3} />

<SeriesNameSeriesHeader />

## Introduction

...

## Summary

<SeriesNameSeriesResources />

## Resources

...
```

## Content Patterns

### Code Examples

This is a code-forward blog. Posts should include abundant, well-formatted code:

- Use fenced code blocks with language identifiers (`csharp, `yaml, ```bash, etc.)
- Keep examples focused and runnable where possible
- When building up a solution incrementally, show the code evolving step by step rather than dumping the final version

### Comparison Tables

Use markdown tables for side-by-side comparisons of tools, features, or approaches. The blog has a `TableWrapper` component that automatically makes tables responsive, so standard markdown table syntax works well.

### Images

- **Banner images**: Place at `/static/images/[slug]/banner.png`. Use markdown syntax in the post.
- **Article images**: Use HTML `<figure>` elements with `<figcaption>` for proper captioning:

```html
<figure>
  <img src="/static/images/[slug]/image-name.png" alt="Descriptive alt text" />
  <figcaption>
    Figure: Descriptive caption explaining what the reader is seeing
  </figcaption>
</figure>
```

- **Placeholder images**: When an image would be valuable but doesn't exist yet, write `PLACEHOLDER_IMAGE` with a description of what the image should show. The author will supply the actual image later.

### Performance and Benchmark Data

When discussing performance, include actual numbers: benchmark results, test output, specific metrics. Concrete data builds credibility and helps readers make informed decisions.

## Writing Approach

### Enterprise Focus

Prioritize production-ready, scalable solutions. The audience works on real systems with real constraints -- tight deadlines, legacy codebases, team politics. Frame recommendations through that lens rather than assuming greenfield ideal conditions.

### Architecture-First

Lead with design decisions and their implications before diving into implementation details. Explain the "why" behind structural choices. This is a blog that values understanding the reasoning, not just copying the code.

### Microsoft Ecosystem Expertise

The blog's core strength is deep knowledge of .NET, Azure, Entity Framework, and the broader Microsoft developer ecosystem. Lean into that expertise. Reference specific framework features, version-specific behavior, and known gotchas.

### Troubleshooting

For complex tutorials, include a section or callout about common issues and their solutions. Readers attempting to follow along will hit these problems, and addressing them preemptively builds trust.

## Structural Rules

These rules govern the structure and format of every post. **For voice and tone rules, see the `daniels-voice` skill** — this section deliberately stays out of that territory.

- **Problem first, solution second** -- don't lead with the answer; establish why it matters first
- **Include code blocks with language identifiers** for syntax highlighting on every code example
- **Back up claims with specifics** -- numbers, measurements, real examples. Vague assertions erode trust.
- **Internal links woven naturally into the text** -- not dumped in a list at the end
- **Be specific about what the reader will learn** in the title — generic titles like "A Guide to X" lose to specific ones like "Building a Custom Claude Code Statusline to Track Worktrees and Usage"

## Things to Avoid

Structural / format issues (voice issues live in `daniels-voice`):

- Using the `<Image>` component for banner images (use markdown `![Banner](...)` syntax)
- Importing `TOCInline` -- it's automatically available
- Forgetting the Introduction, Summary, or Resources sections
- Creating images directly -- use `PLACEHOLDER_IMAGE` and let the author supply them
- Making claims without concrete data or real examples to back them up
- Dumping internal links in a list -- weave them naturally into the prose
