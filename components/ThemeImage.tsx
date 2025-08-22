'use client'
import { useTheme } from 'next-themes'
import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'
type Props = Omit<ImageProps, 'src' | 'priority' | 'loading'> & {
  srcLight: string
  srcDark: string
}
const ThemeImage = (props: Props) => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const { srcLight, srcDark, ...rest } = props

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <Image {...rest} src={srcLight} className={`${isDark ? 'hidden' : ''}`} />
      <Image {...rest} src={srcDark} className={`${isDark ? '' : 'hidden'}`} />
    </>
  )
}

export default ThemeImage
