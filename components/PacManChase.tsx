/**
 * Hover easter egg for the Pac-Man project card: a little Pac-Man chomps a
 * trail of dots next to the title. Hidden until the surrounding `group` is
 * hovered; purely decorative, so it's aria-hidden and reduced-motion shows a
 * static Pac-Man without the chomp/eat loop.
 */
const PacManChase = () => (
  <span
    aria-hidden="true"
    className="inline-flex items-center gap-1.5 align-middle opacity-0 transition-opacity duration-300 group-hover:opacity-100"
  >
    <span className="h-4 w-4 rounded-full bg-yellow-400 [clip-path:polygon(100%_74%,44%_48%,100%_21%,100%_0%,0%_0%,0%_100%,100%_100%)] motion-safe:group-hover:animate-[pac-chomp_0.35s_linear_infinite]" />
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-gray-400 motion-safe:group-hover:animate-[pac-dot-eaten_1.2s_linear_infinite] dark:bg-gray-500"
        style={{ animationDelay: `${i * 0.4}s` }}
      />
    ))}
  </span>
)

export default PacManChase
