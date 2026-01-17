# Copilot Instructions for Dan Does Code Blog

## Architecture Overview

This is a Next.js 14 personal blog using the App Router, Contentlayer for MDX processing, and Tailwind CSS. The site is optimized for performance and SEO, featuring a tech blog focused on .NET and software architecture content.

### Key Dependencies & Technologies
- **Content**: Contentlayer processes MDX files in `data/blog/` and `data/authors/`
- **Styling**: Tailwind CSS with custom configuration in `tailwind.config.js`
- **Typography**: Space Grotesk font via next/font
- **Search**: Pliny search provider with Kbar integration
- **Analytics**: Google Analytics + Vercel Analytics/Speed Insights
- **Comments**: Configured for Giscus (see `data/siteMetadata.js`)

## Content Management Patterns

### Blog Post Structure
- All posts live in `data/blog/` as `.mdx` files
- **Series Organization**: Related posts grouped in subdirectories (e.g., `bicep/`, `modular-monolith/`)
- **Custom Components**: Series-specific components in `components/[series-name]/` for navigation and resources
- **Frontmatter Schema**: Defined in `contentlayer.config.ts` - always include `title`, `date`, `tags`, `summary`

### MDX Component System
- Register custom components in `components/MDXComponents.tsx`
- Series headers/resources components are pre-built for content navigation
- Example: `<BicepSeriesHeader />` in bicep posts automatically generates series navigation

### Content Processing
- **Auto-generated**: Tag counts (`app/tag-data.json`), search index (`public/search.json`), TOC extraction
- **Reading time**: Automatically calculated via `reading-time` package
- **Slug generation**: Auto-derived from file path with GitHub slugger

## Development Workflows

### Essential Commands
```bash
yarn dev          # Development server with hot reload
yarn build        # Production build + post-build tag/search generation  
yarn lint         # ESLint across app/, components/, layouts/, scripts/
yarn analyze      # Bundle analysis with ANALYZE=true
```

### Content Development
1. Create `.mdx` files in `data/blog/[category]/` for series or `data/blog/` for standalone posts
2. Use frontmatter schema from `contentlayer.config.ts`
3. For new series: Create matching components in `components/[series-name]/` and register in `MDXComponents.tsx`
4. Tags auto-generate pages at `/tags/[tag]` - use kebab-case consistently

### Site Configuration
- **Global settings**: `data/siteMetadata.js` (author, social links, analytics, theme)
- **Navigation**: `data/headerNavLinks.ts`
- **Projects**: `data/projectsData.js` for `/projects` page
- **SEO**: Structured data auto-generated per post in `contentlayer.config.ts`

## Layout System

### Post Layouts (in `layouts/`)
- `PostLayout`: Default 2-column with author sidebar
- `PostSimple`: Minimal single-column
- `PostBanner`: Features hero image
- Specify via frontmatter: `layout: PostLayout`

### Custom Components Patterns
- **Image**: Use `@/components/Image` (Next.js optimized)
- **Links**: Use `@/components/Link` (internal/external detection)
- **Code**: Syntax highlighting via rehype-prism-plus with line numbers
- **Tables**: Auto-wrapped with `TableWrapper` for responsive design

## Performance & Security

### Build Process
- **Post-build**: `scripts/postbuild.mjs` generates tag counts and search indices
- **MDX Processing**: Extensive plugin chain (math, citations, code titles, image optimization)
- **Security Headers**: Comprehensive CSP in `next.config.js` - update for new external services

### Content Security
- **Draft Posts**: Set `draft: true` in frontmatter (excluded from production)
- **Image Optimization**: All images processed through Next.js Image component
- **External Links**: Content Security Policy restricts script sources

## Customization Points

### Theme System
- **Colors**: Modify `tailwind.config.js` primary color variables
- **Typography**: Update `@tailwindcss/typography` prose classes in `css/tailwind.css`
- **Code Highlighting**: Customize `css/prism.css` for syntax themes
- **Dark Mode**: Automatic via `next-themes` with system preference detection

### Adding New Features
- **New Content Types**: Extend `contentlayer.config.ts` document types
- **Custom MDX Components**: Register in `MDXComponents.tsx` for use in posts
- **Navigation**: Update `data/headerNavLinks.ts` for header menu items
- **Author Profiles**: Add `.mdx` files to `data/authors/` directory

When modifying content or components, always consider the automatic build processes that generate tag counts, search indices, and structured data.
