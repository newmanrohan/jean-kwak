'use client'

import { useState } from 'react'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface ProjectImage {
  image: {
    asset: { _ref: string }
  }
  caption?: string
}

interface FeaturedProject {
  _id: string
  title: string
  slug: string
  images: ProjectImage[] | null
}

interface ProjectSliderProps {
  projects: FeaturedProject[]
}

export default function ProjectSlider({ projects }: ProjectSliderProps) {
  const [index, setIndex] = useState(0)

  if (!projects || projects.length === 0) return null

  const current = projects[index]
  const firstImage = current.images?.[0]
  if (!firstImage) return null

  const url = urlFor(firstImage.image).width(1920).height(1080).fit('crop').url()

  const prev = () => setIndex(i => (i - 1 + projects.length) % projects.length)
  const next = () => setIndex(i => (i + 1) % projects.length)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src={url}
        alt={current.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* Project name + link */}
      <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ color: 'white', fontSize: 14, letterSpacing: '0.05em', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {current.title}
        </span>
        <Link
          href={`/${current.slug}`}
          style={{ color: 'white', fontSize: 14, letterSpacing: '0.05em', textShadow: '0 1px 3px rgba(0,0,0,0.5)', textDecoration: 'none' }}
        >
          View Project
        </Link>
      </div>
      {/* Arrows */}
      {projects.length > 1 && (
        <>
          <button onClick={prev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer' }}>←</button>
          <button onClick={next} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer' }}>→</button>
        </>
      )}
    </div>
  )
}
