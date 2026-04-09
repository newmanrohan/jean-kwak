'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
        paddingTop: '7px',
        height: '58px',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'QuadrantText',
          fontWeight: 200,
          fontSize: '18px',
          lineHeight: '2.26em',
          color: '#2B2B2B',
          textDecoration: 'none',
        }}
      >
        Jean Kwak Architects
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <Link
          href="/project-index"
          style={{
            fontFamily: 'QuadrantText',
            fontWeight: 200,
            fontSize: '18px',
            lineHeight: '2.26em',
            textAlign: 'right',
            textDecoration: 'none',
            color: '#141414',
            transition: 'opacity 0.6s ease-in-out',
            opacity: pathname === '/information' ? 0.45 : 1,
          }}
        >
          Project Index,
        </Link>
        <Link
          href="/information"
          style={{
            fontFamily: 'QuadrantText',
            fontWeight: 200,
            fontSize: '18px',
            lineHeight: '2.26em',
            textAlign: 'right',
            textDecoration: 'none',
            color: '#141414',
            transition: 'opacity 0.6s ease-in-out',
            opacity: pathname === '/project-index' ? 0.45 : 1,
          }}
        >
          Information
        </Link>
      </div>
    </nav>
  )
}
