/**
 * Star counts for public repos, fetched server-side.
 *
 * Returns null when the repo can't be read (private, missing, rate-limited, or
 * network failure) — callers treat null as "no public repo info", which hides
 * both the star badge and the repo link. A public repo with zero stars returns
 * 0, so the repo link still renders while the badge stays hidden.
 */
export async function getRepoStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
      // Revalidate hourly so star counts stay fresh without hitting the
      // unauthenticated rate limit (60 req/hr covers our handful of repos)
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      // 404 is expected for private repos; anything else is worth a build log
      if (res.status !== 404) {
        console.warn(`GitHub API returned ${res.status} for ${repo}`)
      }
      return null
    }
    const data: unknown = await res.json()
    if (
      typeof data === 'object' &&
      data !== null &&
      'stargazers_count' in data &&
      typeof data.stargazers_count === 'number'
    ) {
      return data.stargazers_count
    }
    console.warn(`GitHub API response for ${repo} had no numeric stargazers_count`)
    return null
  } catch (error) {
    console.warn(`Failed to fetch stars for ${repo}:`, error)
    return null
  }
}
