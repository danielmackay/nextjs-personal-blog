'use client'

import { useEffect } from 'react'

/**
 * Easter egg for visitors who open DevTools: a wordmark and a pointer to the
 * site's source. Logs once per mount; renders nothing.
 */
const ConsoleEgg = () => {
  useEffect(() => {
    console.log(
      '%cDAN %cDOES CODE',
      'color:#111827;font-size:20px;font-weight:800;font-family:"Space Grotesk",sans-serif',
      'color:#0EA5E9;font-size:20px;font-weight:800;font-family:"Space Grotesk",sans-serif'
    )
    console.log(
      "Poking around the console? You're my kind of visitor. This whole site is open source: https://github.com/danielmackay/nextjs-personal-blog"
    )
  }, [])

  return null
}

export default ConsoleEgg
