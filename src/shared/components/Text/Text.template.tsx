import React, { useState } from 'react'
import { clsx } from 'clsx'
import { TextProps } from './Text.types'

const defaultElementContainer = 'p'
const allowedElements = ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const fontFamilies = {
  'dm-sans': 'font-dm-sans',
  lato: 'font-lato',
  santander: 'font-santander',
}

const TextTemplate = ({
  children,
  className,
  color = 'black',
  size = 'text-base',
  fontFamily = 'santander',
  as = defaultElementContainer,
  title = '',
}: TextProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const elementProps: React.HTMLProps<HTMLElement> = {
    className: clsx(className, color, size, fontFamilies[fontFamily]),
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }

  if (title && isHovered) {
    elementProps.title = title as string
  }

  return React.createElement(
    allowedElements.includes(as) ? as : defaultElementContainer,
    elementProps,
    children
  )
}

export default TextTemplate
