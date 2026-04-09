'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { urlFor } from '@/lib/sanity'
import { TRANSITION, TRANSITION_MS } from '@/lib/constants'
import TransitionLink from './TransitionLink'

interface ProjectImage {
  image: { asset: { _ref: string } }
  caption?: string
}

interface FeaturedProject {
  _id: string
  title: string
  slug: string
  images: ProjectImage[] | null
}

export default function ProjectSlider({ projects }: { projects: FeaturedProject[] }) {
  const [index, setIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const isTransitioning = useRef(false)
  const indexRef = useRef(0)

  useEffect(() => { indexRef.current = index }, [index])

  // All project images are always mounted at opacity 0.
  // setIndex + setOpacity(1) in the same setTimeout batch triggers the
  // CSS transition immediately — no rAF needed.
  const goToIndex = useCallback((newIndex: number) => {
    if (isTransitioning.current) return
    isTransitioning.current = true
    setOpacity(0)
    setTimeout(() => {
      setIndex(newIndex)
      setOpacity(1)
      isTransitioning.current = false
    }, TRANSITION_MS)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')
        goToIndex((indexRef.current - 1 + projects.length) % projects.length)
      if (e.key === 'ArrowRight')
        goToIndex((indexRef.current + 1) % projects.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [projects.length, goToIndex])

  if (!projects.length) return null

  const project = projects[index]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#F7F2E9',
        userSelect: 'none',
      }}
    >
      {/* All project images always mounted — incoming sits at opacity 0 until active */}
      {projects.map((proj, i) => {
        const firstImage = proj.images?.[0]
        if (!firstImage) return null
        const url = urlFor(firstImage.image).width(1400).url()
        return (
          <div
            key={proj._id}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: index === i ? opacity : 0,
              transition: `opacity ${TRANSITION}`,
              pointerEvents: index === i ? 'auto' : 'none',
            }}
          >
            <img
              src={url}
              alt={proj.title}
              style={{
                maxHeight: '63vh',
                maxWidth: '60%',
                objectFit: 'cover',
                display: 'block',
              }}
              draggable={false}
            />
          </div>
        )
      })}

      {/* Click zones: left half = prev, right half = next */}
      {projects.length > 1 && (
        <>
          <div
            onClick={() => goToIndex((index - 1 + projects.length) % projects.length)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              bottom: '58px',
              cursor: 'pointer',
              zIndex: 5,
            }}
          />
          <div
            onClick={() => goToIndex((index + 1) % projects.length)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              bottom: '58px',
              cursor: 'pointer',
              zIndex: 5,
            }}
          />
        </>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '20px',
          paddingRight: '20px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '17px' }}>
          <span
            style={{
              fontFamily: 'QuadrantTextMono',
              fontWeight: 400,
              fontSize: '14px',
              letterSpacing: '0.03em',
              lineHeight: '1.18',
              color: '#000',
              width: '37px',
              flexShrink: 0,
            }}
          >
            ({index + 1})
          </span>
          <TransitionLink
            href={`/${project.slug}`}
            style={{
              fontFamily: 'QuadrantText',
              fontWeight: 200,
              fontSize: '18px',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            {project.title}
          </TransitionLink>
        </div>
        <span
          style={{
            fontFamily: 'QuadrantTextMono',
            fontWeight: 400,
            fontSize: '14px',
            letterSpacing: '0.03em',
            lineHeight: '1.18',
            color: '#000',
          }}
        >
          ({index + 1} / {projects.length})
        </span>
      </div>
    </div>
  )
}
