---
applyTo: '*.mdx'
---

## Blog Authoring Guidelines

### Writing Style & Tone
- **Personal and Conversational**: Use first-person perspective, share personal experiences and anecdotes
- **Approachable Expert**: Technical but accessible - explain complex concepts without intimidating beginners
- **Honest and Balanced**: Acknowledge limitations, trade-offs, and real-world challenges rather than overselling solutions
- **Strategic Emoji Use**: Include emojis for emphasis (✅❌⚠️😆🙌) but use sparingly and purposefully

### Content Structure Requirements
- **TOC Integration**: Always include `<TOCInline toc={props.toc} exclude="Overview" toHeading={3} />`
- **TOCInline Component**: Do not import directly in the file, it will be handled automatically
- **Banner Images**: Create custom header images at `/static/images/[slug]/banner.png`
- **Prerequisites Section**: Clearly state what readers need before starting (tools, knowledge, accounts)
- **Introduction Pattern**: Context → Problem → What we'll accomplish
- **Step-by-Step Format**: Use numbered sections for tutorials and guides

### Technical Content Patterns
- **Code-Forward Approach**: Include abundant, well-formatted code examples with syntax highlighting
- **Comparison Tables**: Use markdown tables for side-by-side feature/tool comparisons
- **Performance Data**: Include actual benchmarks, test results, and specific metrics when relevant
- **Visual Documentation**: Support explanations with screenshots, diagrams, and architecture drawings

### Frontmatter Standards
```yaml
title: 'Descriptive Title - Avoid Generic Names'
date: 'YYYY-MM-DD'
tags: ['dotnet', 'azure', 'specific-tech'] # Use kebab-case, focus on searchable terms
draft: false # Set to true while writing
summary: 'Compelling 1-2 sentence summary highlighting the practical value'
images: ['/static/images/[slug]/banner.png']
layout: PostLayout # Default for most technical content
```

### Voice & Messaging
- **Workplace Anecdotes**: Reference colleague interactions and real project experiences
- **Tool Pragmatism**: Evaluate technologies based on practical benefits vs theoretical ideals
- **Process Documentation**: Focus on "how" and "why" decisions are made, not just "what"
- **Enterprise Focus**: Emphasize production-ready, scalable solutions over quick hacks

### Content Organization
- **Series Navigation**: For multi-part content, create series components in `components/[series-name]/`
- **External Resources**: Include "Additional Resources" section with relevant documentation links
- **Social Engagement**: End with call-to-action for comments and social media interaction
- **Canonical URLs**: Always include for SEO and content attribution

### Technical Writing Best Practices
- **Architecture-First**: Lead with design decisions and their implications
- **Microsoft Ecosystem**: Leverage expertise in .NET, Azure, and Microsoft technologies
- **Real-World Focus**: Prioritize production scenarios over contrived examples
- **Troubleshooting Sections**: Include common issues and their solutions for complex tutorials
