'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: ReactNode
  /** Stagger offset in ms, applied via CSS transition-delay */
  delay?: number
  className?: string
}

/**
 * Fades and slides children up when they scroll into view. The hidden initial
 * state lives in CSS behind a prefers-reduced-motion guard (see tailwind.css),
 * so reduced-motion users and pre-hydration paints show content immediately.
 */
const Reveal = ({ children, delay = 0, className = '' }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Fire slightly before the element fully enters so the motion feels responsive
      { threshold: 0.15 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay > 0 ? { ['--reveal-delay' as string]: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default Reveal
