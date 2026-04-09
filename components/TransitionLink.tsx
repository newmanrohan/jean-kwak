'use client'

import type { CSSProperties } from 'react'
import { useNavigate } from './SiteTransition'

interface Props {
  href: string
  style?: CSSProperties
  children: React.ReactNode
}

export default function TransitionLink({ href, style, children }: Props) {
  const navigate = useNavigate()
  return (
    <a
      href={href}
      style={style}
      onClick={(e) => { e.preventDefault(); navigate(href) }}
    >
      {children}
    </a>
  )
}
