'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TRANSITION, TRANSITION_MS } from '@/lib/constants'

const NavigateCtx = createContext<(href: string) => void>(() => {})

export function useNavigate() {
  return useContext(NavigateCtx)
}

interface Props {
  navigation: React.ReactNode
  children: React.ReactNode
}

export default function SiteTransition({ navigation, children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const prevPathname = useRef<string | null>(null)
  const isNavigating = useRef(false)

  const navigate = useCallback((href: string) => {
    if (isNavigating.current) return
    isNavigating.current = true
    const el = contentRef.current
    if (!el) { router.push(href); return }
    el.style.transition = `opacity ${TRANSITION}`
    el.style.opacity = '0'
    setTimeout(() => router.push(href), TRANSITION_MS)
  }, [router])

  useLayoutEffect(() => {
    isNavigating.current = false
    const el = contentRef.current
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
        el.style.transition = `opacity ${TRANSITION}`
        el.style.opacity = '1'
      })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <NavigateCtx.Provider value={navigate}>
      {/* Navigation sits outside the fading div — never affected by opacity */}
      {navigation}
      <div ref={contentRef} style={{ height: '100%' }}>
        {children}
      </div>
    </NavigateCtx.Provider>
  )
}
