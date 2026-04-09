'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')
        setIndex(i => (i - 1 + projects.length) % projects.length)
      if (e.key === 'ArrowRight')
        setIndex(i => (i + 1) % projects.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [projects.length])

  if (!projects.length) return null

  const project = projects[index]
  const firstImage = project.images?.[0]
  if (!firstImage) return null

  const url = urlFor(firstImage.image).width(1400).url()

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
      {/* Centered image — key forces remount+fadein on project change */}
      <div
        key={project._id}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadein 0.6s ease-in-out',
        }}
      >
        <img
          src={url}
          alt={project.title}
          style={{
            maxHeight: '63vh',
            maxWidth: '60%',
            objectFit: 'cover',
            display: 'block',
          }}
          draggable={false}
        />
      </div>

      {/* Click zones: left half = prev, right half = next */}
      {projects.length > 1 && (
        <>
          <div
            onClick={() => setIndex(i => (i - 1 + projects.length) % projects.length)}
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
            onClick={() => setIndex(i => (i + 1) % projects.length)}
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
          <Link
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
          </Link>
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
