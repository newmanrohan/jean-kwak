'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { urlFor } from '@/lib/sanity'

interface ProjectImage {
  image: { asset: { _ref: string } }
  caption?: string
}

interface Project {
  _id: string
  title: string
  slug: string
  images?: ProjectImage[]
  location?: string | null
  year?: string | null
  builder?: string | null
  photography?: string | null
  landscape?: string | null
  styling?: string | null
  description?: unknown[]
}

interface Props {
  project: Project
  projectNumber: number
}

type Slide =
  | { type: 'title' }
  | { type: 'image'; imgIndex: number }
  | { type: 'info' }

const serif: React.CSSProperties = {
  fontFamily: 'QuadrantText',
  fontWeight: 200,
  fontSize: '18px',
  lineHeight: '2.26em',
}

const mono: React.CSSProperties = {
  fontFamily: 'QuadrantTextMono',
  fontWeight: 400,
  fontSize: '14px',
  letterSpacing: '0.03em',
  lineHeight: '1.18',
}

const monoLabel: React.CSSProperties = {
  ...mono,
  textTransform: 'uppercase',
  whiteSpace: 'pre-line',
}

const btnReset: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
}

export default function ProjectSlideShow({ project, projectNumber }: Props) {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  const images = useMemo(() => project.images ?? [], [project.images])

  const slides = useMemo<Slide[]>(
    () => [
      { type: 'title' },
      ...images.map((_, i) => ({ type: 'image' as const, imgIndex: i })),
      { type: 'info' },
    ],
    [images]
  )

  const [slideIndex, setSlideIndex] = useState(0)
  const [lastImageIdx, setLastImageIdx] = useState(0)

  const currentSlide = slides[slideIndex]

  // Track last viewed image index (for info slide counter)
  useEffect(() => {
    if (currentSlide.type === 'image') {
      setLastImageIdx(currentSlide.imgIndex)
    }
  }, [currentSlide])

  // Auto-advance from title slide to first image after 3 s
  useEffect(() => {
    if (slideIndex !== 0) return
    const timer = setTimeout(() => setSlideIndex(1), 3000)
    return () => clearTimeout(timer)
  }, [slideIndex])

  // Arrow key navigation with wrap-around
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')
        setSlideIndex(i => (i - 1 + slides.length) % slides.length)
      if (e.key === 'ArrowRight')
        setSlideIndex(i => (i + 1) % slides.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length])

  const handleClose = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => router.push('/project-index'), 600)
  }, [leaving, router])

  const goToInfo = () => setSlideIndex(slides.length - 1)

  const goToLastImage = () => {
    for (let i = slides.length - 1; i >= 0; i--) {
      if (slides[i].type === 'image') { setSlideIndex(i); return }
    }
    setSlideIndex(0)
  }

  const isTitle = currentSlide.type === 'title'
  const isImage = currentSlide.type === 'image'
  const isInfo  = currentSlide.type === 'info'

  const infoFields = [
    { label: '(Location)',    value: project.location },
    { label: '(Year)',        value: project.year },
    { label: '(Builder)',     value: project.builder },
    { label: '(Photography)', value: project.photography },
    { label: '(Landscape)',   value: project.landscape },
    { label: '(Styling)',     value: project.styling },
  ].filter(f => f.value)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: isTitle ? '#E8D9C4' : '#F7F2E9',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out, background 0.6s ease-in-out',
      }}
    >
      {/* ── TOP BAR ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '7px',
          zIndex: 10,
        }}
      >
        {/* Left: (N) Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '17px', flex: 1 }}>
          <span style={{ ...mono, color: '#2B2B2B', width: '37px', flexShrink: 0 }}>
            ({projectNumber})
          </span>
          <span style={{ ...serif, color: '#2B2B2B' }}>
            {project.title}
          </span>
        </div>

        {/* Center: Show information / Back to images */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {isInfo ? (
            <button onClick={goToLastImage} style={{ ...serif, ...btnReset, color: '#000' }}>
              Back to images
            </button>
          ) : (
            <button onClick={goToInfo} style={{ ...serif, ...btnReset, color: '#000' }}>
              Show information
            </button>
          )}
        </div>

        {/* Right: Close → /project-index */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            style={{ ...serif, ...btnReset, color: '#2B2B2B' }}
          >
            Close
          </button>
        </div>
      </div>

      {/* ── CLICK ZONES (left = prev, right = next, wrap-around) ── */}
      <div
        onClick={() => setSlideIndex(i => (i - 1 + slides.length) % slides.length)}
        style={{
          position: 'absolute',
          top: '58px', left: 0,
          width: '50%',
          bottom: isInfo ? 0 : '58px',
          cursor: 'pointer',
          zIndex: 5,
        }}
      />
      <div
        onClick={() => setSlideIndex(i => (i + 1) % slides.length)}
        style={{
          position: 'absolute',
          top: '58px', right: 0,
          width: '50%',
          bottom: isInfo ? 0 : '58px',
          cursor: 'pointer',
          zIndex: 5,
        }}
      />

      {/* ── TITLE SLIDE ── */}
      {isTitle && (
        <div
          key="title"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadein 0.6s ease-in-out',
          }}
        >
          <h1
            style={{
              fontFamily: 'QuadrantText',
              fontWeight: 200,
              fontSize: 'clamp(28px, 4vw, 40px)',
              lineHeight: 1.02,
              color: '#000',
              textAlign: 'center',
              maxWidth: '90%',
              margin: 0,
            }}
          >
            {project.title}
          </h1>
        </div>
      )}

      {/* ── IMAGE SLIDE ── */}
      {isImage && (() => {
        const slide = currentSlide as { type: 'image'; imgIndex: number }
        const img = images[slide.imgIndex]
        if (!img) return null
        const url = urlFor(img.image).width(1400).url()
        return (
          <>
            {/* Image fades in on each slide change */}
            <div
              key={slide.imgIndex}
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
                alt={img.caption ?? ''}
                style={{
                  maxHeight: '63vh',
                  maxWidth: '60%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                draggable={false}
              />
            </div>

            {/* Bottom bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '58px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '20px',
                paddingRight: '20px',
                zIndex: 10,
              }}
            >
              <span style={{ ...serif, color: '#000' }}>{img.caption ?? ''}</span>
              <span style={{ ...mono, color: '#000' }}>
                ({slide.imgIndex + 1} / {images.length})
              </span>
            </div>
          </>
        )
      })()}

      {/* ── INFO SLIDE ── */}
      {isInfo && (
        <>
          {/*
            Scrollable content area between the two bars.
            Responsive: stacks on mobile, two-column on desktop.
            Desktop mirrors the information page layout:
              [metadata ~24%] [gap ~37%] [description flex-1]
          */}
          <div
            style={{
              position: 'absolute',
              top: '58px',
              bottom: '58px',
              left: 0,
              right: 0,
              overflowY: 'auto',
              animation: 'fadein 0.6s ease-in-out',
            }}
          >
            <div className="flex flex-col lg:flex-row px-5 py-8">

              {/* Left: metadata labels + values (~24%) */}
              {infoFields.length > 0 && (
                <div className="shrink-0 mb-8 lg:mb-0 lg:w-[24%]">
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ ...monoLabel, color: '#000' }}>
                      {infoFields.map(f => f.label).join('\n')}
                    </div>
                    <div style={{ ...monoLabel, color: '#000' }}>
                      {infoFields.map(f => f.value!).join('\n')}
                    </div>
                  </div>
                </div>
              )}

              {/* Gap — desktop only (~27%) */}
              <div className="hidden lg:block shrink-0 lg:w-[27%]" />

              {/* Right: (about) label LEFT of description */}
              <div className="flex-1 min-w-0 flex flex-col lg:flex-row">
                <div
                  className="shrink-0 mb-4 lg:mb-0 lg:w-[22%]"
                  style={{ ...monoLabel, color: '#000' }}
                >
                  (about)
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontFamily: 'QuadrantText',
                      fontWeight: 200,
                      fontSize: '18px',
                      lineHeight: '1.278',
                      color: '#141414',
                    }}
                  >
                    {project.description && project.description.length > 0 && (
                      <PortableText
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        value={project.description as any}
                        components={{
                          block: {
                            normal: ({ children }) => (
                              <p style={{ margin: 0, marginBottom: '1.2em' }}>{children}</p>
                            ),
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '58px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '20px',
              paddingRight: '20px',
              zIndex: 10,
              background: '#F7F2E9',
            }}
          >
            <span style={{ ...serif, color: '#000' }}>Project information</span>
            {images.length > 0 && (
              <span style={{ ...mono, color: '#000' }}>
                ({lastImageIdx + 1} / {images.length})
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
