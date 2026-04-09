'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const prevPathname = useRef<string | null>(null)

  useLayoutEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    if (prevPathname.current === null || prevPathname.current === pathname) {
      prevPathname.current = pathname
      return
    }
    prevPathname.current = pathname
    el.style.transition = 'none'
    el.style.opacity = '0'
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s ease-in-out'
        el.style.opacity = '1'
      })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div ref={wrapperRef} style={{ height: '100%' }}>
      {children}
    </div>
  )
}
