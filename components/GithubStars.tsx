const GithubStars = ({ stars }: { stars: number }) => (
  <span
    className="group/stars inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-slate-50 px-2.5 py-0.5 text-sm font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
    title={`${stars.toLocaleString()} stars on GitHub`}
  >
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5 fill-yellow-500 motion-safe:group-hover/stars:animate-[star-wiggle_0.5s_ease-in-out]"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
    {stars.toLocaleString()}
    <span className="sr-only">GitHub stars</span>
  </span>
)

export default GithubStars
