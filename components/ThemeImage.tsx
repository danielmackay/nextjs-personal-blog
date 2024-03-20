'use client'
import { useTheme } from 'next-themes'
import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'
type Props = Omit<ImageProps, 'src' | 'priority' | 'loading'> & {
    srcLight: string
    srcDark: string
}
const ThemeImage = (props: Props) => {
    const [showLight, setShowLight] = useState(false)
    const { theme } = useTheme()
    const { srcLight, srcDark, ...rest } = props

    useEffect(() => {
        setShowLight(theme === 'dark')
    }, [theme])

    return (
        <>
            <Image {...rest} src={srcLight} className={`${showLight ? 'hidden' : ''}`} />
            <Image {...rest} src={srcDark} className={`${showLight ? '' : 'hidden'}`} />
        </>
    )
}

export default ThemeImage
