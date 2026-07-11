import Image from './Image'
import Link from './Link'
import GithubStars from './GithubStars'
import Reveal from './Reveal'
import PacManChase from './PacManChase'
import { Github, Website } from './social-icons/icons'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  /** GitHub repo URL; only pass when the repo is publicly readable */
  githubUrl?: string
  /** Star count; the badge renders only when ≥ 1 */
  stars?: number | null
  /** Scroll-reveal stagger in ms, e.g. alternating per grid column */
  revealDelay?: number
  /** Hover-revealed easter egg next to the title */
  easterEgg?: 'pacman'
}

const iconLinkClasses =
  'text-gray-700 transition-colors hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400'

const Card = ({
  title,
  description,
  imgSrc,
  href,
  githubUrl,
  stars,
  revealDelay,
  easterEgg,
}: CardProps) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <Reveal
      delay={revealDelay}
      className={`${
        imgSrc && 'h-full'
      }  group overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold leading-8 tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
          {typeof stars === 'number' && stars > 0 && <GithubStars stars={stars} />}
          {easterEgg === 'pacman' && <PacManChase />}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        <div className="flex items-center gap-4">
          {href && href !== githubUrl && (
            <Link
              href={href}
              className={iconLinkClasses}
              aria-label={`${title} website`}
              title="Website"
            >
              <Website className="h-5 w-5 fill-none stroke-current" />
            </Link>
          )}
          {githubUrl && (
            <Link
              href={githubUrl}
              className={iconLinkClasses}
              aria-label={`${title} on GitHub`}
              title="GitHub"
            >
              <Github className="h-5 w-5 fill-current" />
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  </div>
)

export default Card
