import Image from './Image'
import Link from './Link'
import GithubStars from './GithubStars'
import Reveal from './Reveal'
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
      <Reveal className={flip ? 'lg:order-2' : ''}>
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
      </Reveal>
      <Reveal delay={120} className={`flex justify-center ${flip ? 'lg:order-1' : ''}`}>
        <Link href={href} aria-label={`Link to ${title}`}>
          <Image
            alt={`${title} screenshot`}
            src={imgSrc}
            width={project.imgWidth ?? 375}
            height={project.imgHeight ?? 667}
            priority={priority}
            className="w-full max-w-[260px] rounded-2xl border border-gray-200 shadow-[0_24px_48px_-24px_rgba(2,132,199,0.35)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_32px_56px_-24px_rgba(2,132,199,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-gray-700 dark:shadow-[0_24px_48px_-24px_rgba(56,189,248,0.25)] dark:hover:shadow-[0_32px_56px_-24px_rgba(56,189,248,0.35)]"
          />
        </Link>
      </Reveal>
    </article>
  )
}

export default FeaturedProjectCard
