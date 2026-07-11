import Image from './Image'
import Link from './Link'
import GithubStars from './GithubStars'
import { Github } from './social-icons/icons'
import type { Project } from '@/data/projectsData'

interface Props {
  project: Project
  /** Star count when the repo is publicly readable, otherwise null */
  stars: number | null
  /** Reverse the text/media columns so consecutive rows alternate */
  flip?: boolean
  /** Set on the first row: its screenshot is the LCP, so it should load eagerly */
  priority?: boolean
}

const FeaturedProjectCard = ({ project, stars, flip = false, priority = false }: Props) => {
  const { title, description, imgSrc, href, github, appStore, platform, cta } = project
  // stars === null means the repo isn't publicly readable, so a link would 404 for visitors
  const githubUrl = github && stars !== null ? `https://github.com/${github}` : undefined

  return (
    <article className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className={flip ? 'lg:order-2' : ''}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
          Featured{platform && ` · ${platform}`}
        </p>
        <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          <Link href={href} aria-label={`Link to ${title}`}>
            {title}
          </Link>
          {stars !== null && stars > 0 && (
            <span className="ml-4 align-middle">
              <GithubStars stars={stars} />
            </span>
          )}
        </h2>
        <p className="mb-6 max-w-prose leading-relaxed text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={href}
            className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label={`Link to ${title}`}
          >
            {cta ?? 'Learn more'} &rarr;
          </Link>
          {appStore && (
            <Link
              href={appStore}
              className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`${title} on the App Store`}
            >
              App Store &rarr;
            </Link>
          )}
          {githubUrl && (
            <Link
              href={githubUrl}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              aria-label={`${title} on GitHub`}
            >
              <Github className="h-5 w-5 fill-current" />
            </Link>
          )}
        </div>
      </div>
      <div className={`flex justify-center ${flip ? 'lg:order-1' : ''}`}>
        <Image
          alt={`${title} screenshot`}
          src={imgSrc}
          width={project.imgWidth ?? 375}
          height={project.imgHeight ?? 667}
          priority={priority}
          className="w-full max-w-[260px] rounded-2xl border border-gray-200 shadow-[0_24px_48px_-24px_rgba(2,132,199,0.35)] dark:border-gray-700 dark:shadow-[0_24px_48px_-24px_rgba(56,189,248,0.25)]"
        />
      </div>
    </article>
  )
}

export default FeaturedProjectCard
