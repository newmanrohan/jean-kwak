'use client'

import { usePathname } from 'next/navigation'
import { TRANSITION } from '@/lib/constants'
import TransitionLink from './TransitionLink'

const KNOWN_ROUTES = new Set(['/', '/project-index', '/information'])

export default function Navigation() {
  const pathname = usePathname()
  if (!KNOWN_ROUTES.has(pathname)) return null

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '0px',
        height: '58px',
      }}
    >
      <TransitionLink
        href="/"
        style={{
          fontFamily: 'QuadrantText',
          fontWeight: 200,
          fontSize: 'var(--font-body)',
          lineHeight: '2.26em',
          color: '#2B2B2B',
          textDecoration: 'none',
        }}
      >
        Jean Kwak Architects
      </TransitionLink>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <TransitionLink
          href="/project-index"
          style={{
            fontFamily: 'QuadrantText',
            fontWeight: 200,
            fontSize: 'var(--font-body)',
            lineHeight: '2.26em',
            textAlign: 'right',
            textDecoration: 'none',
            color: '#141414',
            transition: `opacity ${TRANSITION}`,
            opacity: pathname === '/information' ? 0.45 : 1,
          }}
        >
          <span className="hidden lg:inline">Project Index,</span>
          <span className="lg:hidden">Index,</span>
        </TransitionLink>
        <TransitionLink
          href="/information"
          style={{
            fontFamily: 'QuadrantText',
            fontWeight: 200,
            fontSize: 'var(--font-body)',
            lineHeight: '2.26em',
            textAlign: 'right',
            textDecoration: 'none',
            color: '#141414',
            transition: `opacity ${TRANSITION}`,
            opacity: pathname === '/project-index' ? 0.45 : 1,
          }}
        >
          Information
        </TransitionLink>
      </div>
    </nav>
  )
}
