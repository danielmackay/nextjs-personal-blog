import Link from 'next/link'

const ModularMonolithSeriesHeader = () => {
  return (
    <>
      <h2>Series</h2>
      <p>
        This post is part of a Modular Monolith series, in which we'll dive into the many facets
        associated with the architecture.
      </p>
      <ul>
        <li>
          <Link href="/blog/modular-monolith/a-gentle-introduction">
            Part 1: Modular Monoliths - A Gentle Introduction
          </Link>
        </li>
        <li>
          <Link href="/blog/modular-monolith/implementation-deep-dive">
            Part 2: Modular Monoliths - Implementation Deep Dive
          </Link>
        </li>
        <li>
          <Link href="/blog/modular-monolith/simplifying-the-inner-dev-loop-with-aspire">
            Part 3: Modular Monoliths - Simplifying the Inner Dev Loop with .NET Aspire
          </Link>
        </li>
        <li>Part 4: Coming Soon</li>
      </ul>
    </>
  )
}

export default ModularMonolithSeriesHeader
