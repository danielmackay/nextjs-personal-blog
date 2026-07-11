export interface Project {
  title: string
  description: string
  /** Screenshot shown on featured spotlight rows (and grid cards when set) */
  imgSrc: string
  /** Intrinsic pixel dimensions of imgSrc, required by next/image on featured rows */
  imgWidth?: number
  imgHeight?: number
  /** Primary destination: live site, or repo for code-only projects */
  href: string
  /** GitHub repo as owner/name. Star count and repo link render only when the repo is publicly readable. */
  github?: string
  /** App Store listing, rendered as an extra link when present */
  appStore?: string
  /** Featured projects render as full-width spotlight rows above the grid */
  featured?: boolean
  /** Short platform label for the featured eyebrow, e.g. 'iOS' or 'Web' */
  platform?: string
  /** Call-to-action label; defaults to 'Learn more' on grid cards */
  cta?: string
  /** Hover-revealed easter egg on the grid card title */
  easterEgg?: 'pacman'
}

const projectsData: Project[] = [
  {
    title: 'Gym Buddy',
    description: `A native iOS workout-tracking app built with SwiftUI. Guides you through your sessions with automatic rest timers, works offline, and syncs across devices via iCloud — no subscription, just a one-time Pro unlock.`,
    imgSrc: '/static/images/projects/gym-buddy.png',
    imgWidth: 620,
    imgHeight: 1347,
    href: 'https://gymbuddy.dandoescode.com/',
    github: 'danielmackay/gym-buddy',
    appStore: 'https://apps.apple.com/us/app/gym-buddy-workout-tracker/id6785804061',
    featured: true,
    platform: 'iOS',
    cta: 'Visit the site',
  },
  {
    title: 'Dollarbucks',
    description: `A mobile-first PWA for managing children's allowances and chores. Parents set chores per child that either pay out instantly or build weighted credit toward a weekly allowance, with a full ledger tracking every child's running balance.`,
    imgSrc: '/static/images/projects/dollarbucks.png',
    imgWidth: 375,
    imgHeight: 667,
    href: 'https://dollarbucks.vercel.app/',
    github: 'danielmackay/dollarbucks',
    featured: true,
    platform: 'Web',
    cta: 'Try it out',
  },
  {
    title: 'Claude Code Statusline',
    description: `A custom statusline script for Claude Code that shows real-time session info in your terminal — active model, context usage, cost, rate limits, and git branch, all with emojis and progress bars.`,
    imgSrc: '',
    href: 'https://github.com/danielmackay/claude-code-statusline',
    github: 'danielmackay/claude-code-statusline',
  },
  {
    title: 'Subby',
    description: `Subby — a mobile-first PWA for managing sports team substitutions on the go. Keep track of who's on the bench and on the field so everyone gets a fair run.`,
    imgSrc: '',
    href: 'https://subby.dandoescode.com/',
    github: 'danielmackay/subby',
  },
  {
    title: 'RSVP Teleprompter',
    description: `A web-based RSVP (Rapid Serial Visual Presentation) teleprompter. Paste any text and read it word-by-word at a configurable speed — great for focused reading and improving reading pace.`,
    imgSrc: '',
    href: 'https://rsvp-teleprompter.vercel.app/',
    github: 'danielmackay/rsvp-teleprompter',
  },
  {
    title: 'Tic Tac Toe',
    description: `A classic Tic Tac Toe game built for the web. Play against an AI opponent in this fun implementation of the timeless strategy game.`,
    imgSrc: '',
    href: 'https://tic-tac-toe-phi-tawny.vercel.app/',
    github: 'danielmackay/tic-tac-toe',
  },
  {
    title: 'Space Invaders',
    description: `A web-based recreation of the classic Space Invaders arcade game. Defend Earth from waves of descending alien invaders!`,
    imgSrc: '',
    href: 'https://space-invaders-tawny-xi.vercel.app/',
    github: 'danielmackay/space-invaders',
  },
  {
    title: 'Pac-Man',
    description: `A web-based recreation of the classic Pac-Man arcade game. Navigate the maze, eat all the dots, and avoid the ghosts!`,
    imgSrc: '',
    href: 'https://pacman-navy-xi.vercel.app/',
    github: 'danielmackay/pacman',
    easterEgg: 'pacman',
  },
]

export default projectsData
