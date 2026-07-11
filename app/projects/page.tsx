import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import FeaturedProjectCard from '@/components/FeaturedProjectCard'
import ConsoleEgg from '@/components/ConsoleEgg'
import { genPageMetadata } from 'app/seo'
import { getRepoStars } from '../../lib/github'

export const metadata = genPageMetadata({ title: 'Projects' })

export default async function Projects() {
  // One lookup per repo, resolved server-side so the page ships with no client fetch
  const starEntries = await Promise.all(
    projectsData.map(
      async (p) => [p.title, p.github ? await getRepoStars(p.github) : null] as const
    )
  )
  const starsByTitle = new Map(starEntries)

  const featured = projectsData.filter((p) => p.featured)
  const rest = projectsData.filter((p) => !p.featured)

  return (
    <>
      <ConsoleEgg />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
        </div>
        {featured.map((project, i) => (
          <FeaturedProjectCard
            key={project.title}
            project={project}
            stars={starsByTitle.get(project.title) ?? null}
            flip={i % 2 === 1}
            priority={i === 0}
          />
        ))}
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {rest.map((d, i) => {
              const stars = starsByTitle.get(d.title) ?? null
              return (
                <Card
                  key={d.title}
                  title={d.title}
                  description={d.description}
                  imgSrc={d.imgSrc}
                  href={d.href}
                  stars={stars}
                  // Right-hand column trails its row partner slightly as rows scroll in
                  revealDelay={(i % 2) * 100}
                  easterEgg={d.easterEgg}
                  githubUrl={
                    d.github && stars !== null ? `https://github.com/${d.github}` : undefined
                  }
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
