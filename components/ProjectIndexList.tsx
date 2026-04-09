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
  firstImage?: any
}

export default function ProjectIndexList({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  // Persists the last URL so the image doesn't blank during fade-out
  const [displayUrl, setDisplayUrl] = useState<string | null>(null)
  const [imageTop, setImageTop] = useState(0)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseEnter = (i: number) => {
    setHovered(i)
    const el = rowRefs.current[i]
    if (el) {
      // Align image top to the top of this row in the viewport
      setImageTop(el.getBoundingClientRect().top)
    }
    if (projects[i]?.firstImage) {
      setDisplayUrl(urlFor(projects[i].firstImage).width(300).url())
    }
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div>
      {/* Preview image — always in DOM; opacity animates on hover */}
      <div
        style={{
          position: 'fixed',
          top: imageTop,
          right: '20px',
          width: '294px',
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
              maxHeight: '393px',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      {/* (index) label — fixed below nav on left */}
      <div
        style={{
          position: 'fixed',
          top: '158px',
          left: '20px',
          width: '144px',
          fontFamily: 'QuadrantTextMono',
          fontWeight: 400,
          fontSize: '14px',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          lineHeight: '1.18',
          color: '#000',
        }}
      >
        (index)
      </div>

      {/* Project rows */}
      <div style={{ marginLeft: '196px' }}>
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
                fontSize: '14px',
                letterSpacing: '0.03em',
                lineHeight: '1.18',
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
                fontSize: '18px',
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
