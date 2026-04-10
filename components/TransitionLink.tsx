'use client'

import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigate } from './SiteTransition'

interface Props {
  href: string
  style?: CSSProperties
  children: React.ReactNode
}

export default function TransitionLink({ href, style, children }: Props) {
  const navigate = useNavigate()
  const pathname = usePathname()
  return (
    <a
      href={href}
      style={style}
      onClick={(e) => { e.preventDefault(); if (href === pathname) return; navigate(href) }}
    >
      {children}
    </a>
  )
}
