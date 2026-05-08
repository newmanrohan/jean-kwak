'use client'

import { useState, useRef } from 'react'
import { urlFor } from '@/lib/sanity'
import { TRANSITION } from '@/lib/constants'
import TransitionLink from './TransitionLink'

interface Project {
  _id: string
  title: string
  slug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thumbnail?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  firstImage?: any
}

export default function ProjectIndexList({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  // Persists the last URL so the image doesn't blank during fade-out
  const [displayUrl, setDisplayUrl] = useState<string | null>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseEnter = (i: number) => {
    setHovered(i)
    const img = projects[i]?.thumbnail ?? projects[i]?.firstImage
    if (img) {
      setDisplayUrl(urlFor(img).width(880).url())
    } else {
      setDisplayUrl(null)
    }
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div>
      {/* Desktop: preview image on hover */}
      <div
        className="hidden lg:block"
        style={{
          position: 'fixed',
          top: '157px',
          right: '20px',
          width: '440px',
          opacity: hovered !== null ? 1 : 0,
          transition: `opacity ${TRANSITION}`,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        {displayUrl && (
          <img
            src={displayUrl}
            alt=""
            style={{
              width: '100%',
              display: 'block',
              maxHeight: '588px',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      {/* Mobile: (INDEX) label */}
      <div
        className="lg:hidden"
        style={{
          paddingLeft: '20px',
          paddingTop: '32px',
          fontFamily: 'QuadrantTextMono',
          fontWeight: 400,
          fontSize: 'var(--font-label)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          lineHeight: '1.416',
          color: '#000',
        }}
      >
        (INDEX)
      </div>

      {/* Mobile: 2-column image grid */}
      <div
        className="lg:hidden grid"
        style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '15px',
          rowGap: '40px',
        }}
      >
        {projects.map((project) => (
          <TransitionLink
            key={project._id}
            href={`/${project.slug}`}
            style={{ textDecoration: 'none' }}
          >
            {(project.thumbnail ?? project.firstImage) && (
              <img
                src={urlFor(project.thumbnail ?? project.firstImage).width(600).url()}
                alt={project.title}
                style={{ width: '100%', display: 'block' }}
              />
            )}
            <div
              style={{
                fontFamily: 'QuadrantText',
                fontWeight: 200,
                fontSize: 'var(--font-body)',
                color: '#2B2B2B',
                lineHeight: '1.3',
                marginTop: '8px',
              }}
            >
              {project.title}
            </div>
          </TransitionLink>
        ))}
      </div>

      {/* Desktop: list with hover interaction */}
      <div className="hidden lg:block" style={{ paddingLeft: '20px' }}>
        {projects.map((project, i) => (
          <div
            key={project._id}
            ref={el => { rowRefs.current[i] = el }}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '17px',
              opacity: hovered !== null && hovered !== i ? 0.5 : 1,
              transition: `opacity ${TRANSITION}`,
            }}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <span
              style={{
                fontFamily: 'QuadrantTextMono',
                fontWeight: 400,
                fontSize: 'var(--font-label)',
                letterSpacing: '0.03em',
                lineHeight: '1.416',
                color: '#000',
                width: '176px',
                flexShrink: 0,
              }}
            >
              {i === 0 ? '(INDEX)' : ''}
            </span>
            <span
              style={{
                fontFamily: 'QuadrantTextMono',
                fontWeight: 400,
                fontSize: 'var(--font-label)',
                letterSpacing: '0.03em',
                lineHeight: '1.416',
                color: '#2B2B2B',
                width: '37px',
                flexShrink: 0,
              }}
            >
              ({i + 1})
            </span>
            <TransitionLink
              href={`/${project.slug}`}
              style={{
                fontFamily: 'QuadrantText',
                fontWeight: 200,
                fontSize: 'var(--font-body)',
                color: '#2B2B2B',
                lineHeight: '1.4',
                textDecoration: 'none',
                display: 'block',
                width: '315px',
              }}
            >
              {project.title}
            </TransitionLink>
          </div>
        ))}
      </div>
    </div>
  )
}
