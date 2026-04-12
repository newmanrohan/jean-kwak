'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { PortableText } from 'next-sanity'
import { urlFor } from '@/lib/sanity'
import { TRANSITION, TRANSITION_MS, TITLE_SLIDE_DELAY_MS } from '@/lib/constants'
import { useNavigate } from './SiteTransition'

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
  fontSize: 'var(--font-body)',
  lineHeight: '2.26em',
}

const mono: React.CSSProperties = {
  fontFamily: 'QuadrantTextMono',
  fontWeight: 400,
  fontSize: 'var(--font-label)',
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
  const navigate = useNavigate()
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
  const [slideOpacity, setSlideOpacity] = useState(1)
  const isTransitioning = useRef(false)
  const slideIndexRef = useRef(0)

  useEffect(() => { slideIndexRef.current = slideIndex }, [slideIndex])

  // All slides are always mounted. The incoming slide is already at opacity 0
  // before navigation, so setSlideIndex + setSlideOpacity(1) in the same
  // setTimeout batch triggers the CSS transition immediately — no rAF needed.
  const goToSlide = useCallback((newIndex: number) => {
    if (isTransitioning.current) return
    isTransitioning.current = true
    setSlideOpacity(0)
    setTimeout(() => {
      setSlideIndex(newIndex)
      setSlideOpacity(1)
      isTransitioning.current = false
    }, TRANSITION_MS)
  }, [])

  const currentSlide = slides[slideIndex]

  // Track last viewed image index (for info slide counter)
  useEffect(() => {
    if (currentSlide.type === 'image') {
      setLastImageIdx(currentSlide.imgIndex)
    }
  }, [currentSlide])

  // Auto-advance from title slide to first image after delay
  useEffect(() => {
    if (slideIndex !== 0) return
    const timer = setTimeout(() => goToSlide(1), TITLE_SLIDE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [slideIndex, goToSlide])

  // Arrow key navigation with wrap-around
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')
        goToSlide((slideIndexRef.current - 1 + slides.length) % slides.length)
      if (e.key === 'ArrowRight')
        goToSlide((slideIndexRef.current + 1) % slides.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length, goToSlide])

  const goToInfo = () => goToSlide(slides.length - 1)

  const goToLastImage = () => {
    for (let i = slides.length - 1; i >= 0; i--) {
      if (slides[i].type === 'image') { goToSlide(i); return }
    }
    goToSlide(0)
  }

  const isTitle = currentSlide.type === 'title'
  const isInfo  = currentSlide.type === 'info'

  const infoFields = [
    { label: '(Location)',    value: project.location },
    { label: '(Year)',        value: project.year },
    { label: '(Builder)',     value: project.builder },
    { label: '(Photography)', value: project.photography },
    { label: '(Landscape)',   value: project.landscape },
    { label: '(Styling)',     value: project.styling },
  ].filter(f => f.value)

  // Returns opacity/transition/pointerEvents for a given slide index.
  // All slides are always mounted; non-active slides sit at opacity 0.
  const slideStyle = (idx: number): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    opacity: slideIndex === idx ? slideOpacity : 0,
    transition: `opacity ${TRANSITION}`,
    pointerEvents: slideIndex === idx ? 'auto' : 'none',
  })

  const infoIdx = slides.length - 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: isTitle ? '#E8D9C4' : '#F7F2E9',
        overflow: 'hidden',
        userSelect: 'none',
        transition: `background ${TRANSITION}`,
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
          justifyContent: 'space-between',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '7px',
          zIndex: 10,
        }}
      >
        <span style={{ ...serif, color: '#2B2B2B' }}>
          {project.title}
        </span>
        <button
          onClick={() => navigate('/project-index')}
          style={{ ...serif, ...btnReset, color: '#2B2B2B' }}
        >
          (Close)
        </button>
      </div>

      {/* ── CLICK ZONES ── */}
      <div
        onClick={() => goToSlide((slideIndex - 1 + slides.length) % slides.length)}
        style={{
          position: 'absolute',
          top: '58px', left: 0,
          width: '50%',
          bottom: '58px',
          cursor: 'pointer',
          zIndex: 5,
        }}
      />
      <div
        onClick={() => goToSlide((slideIndex + 1) % slides.length)}
        style={{
          position: 'absolute',
          top: '58px', right: 0,
          width: '50%',
          bottom: '58px',
          cursor: 'pointer',
          zIndex: 5,
        }}
      />

      {/* ── TITLE SLIDE ── always mounted, visible only when active */}
      <div style={slideStyle(0)}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
      </div>

      {/* ── IMAGE SLIDES ── all mounted; each waits at opacity 0 until active */}
      {images.map((img, i) => {
        const url = urlFor(img.image).width(1400).url()
        const idx = i + 1
        return (
          <div key={i} style={slideStyle(idx)}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={url}
                alt={img.caption ?? ''}
                style={{
                  maxHeight: '63vh',
                  maxWidth: 'max(60vw, min(614px, calc(100vw - 40px)))',
                  objectFit: 'cover',
                  display: 'block',
                }}
                draggable={false}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '58px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '20px',
              }}
            >
              <span style={{ ...mono, color: '#000', width: '24px', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ ...serif, color: '#000', marginLeft: '40px' }}>{img.caption ?? ''}</span>
            </div>
          </div>
        )
      })}

      {/* ── INFO SLIDE ── always mounted, visible only when active */}
      <div style={slideStyle(infoIdx)}>
        <div
          style={{
            position: 'absolute',
            top: '58px',
            bottom: '58px',
            left: 0,
            right: 0,
            overflowY: 'auto',
          }}
        >
          <div className="flex flex-col lg:flex-row px-5 pb-8 pt-[99px]">
            {infoFields.length > 0 && (
              <div className="shrink-0 mb-[40px] lg:mb-0 lg:w-[24%]">
                <div className="grid grid-cols-[144px_1fr] gap-x-[40px]">
                  <div style={{ ...monoLabel, color: '#000' }}>
                    {infoFields.map(f => f.label).join('\n')}
                  </div>
                  <div style={{ ...monoLabel, color: '#000' }}>
                    {infoFields.map(f => f.value!).join('\n')}
                  </div>
                </div>
              </div>
            )}
            <div className="hidden lg:block shrink-0 lg:w-[27%]" />
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-[40px]">
              <div className="shrink-0 lg:w-[22%]" style={{ ...monoLabel, color: '#000' }}>
                (about)
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontFamily: 'QuadrantText',
                    fontWeight: 200,
                    fontSize: 'var(--font-body)',
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
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '20px',
          }}
        >
          {images.length > 0 && (
            <span style={{ ...mono, color: '#000', width: '24px', flexShrink: 0 }}>{lastImageIdx + 1}</span>
          )}
          <span style={{ ...serif, color: '#000', marginLeft: '40px' }}>Project information</span>
        </div>
      </div>

      {/* ── PERSISTENT BOTTOM BAR ── outside opacity wrappers; hidden on title slide */}
      {!isTitle && (
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '44px',
            paddingRight: '20px',
            zIndex: 10,
          }}
        >
          {images.length > 0 && (
            <span style={{ ...mono, color: '#000' }}>/ {images.length}</span>
          )}
          {isInfo ? (
            <button onClick={goToLastImage} style={{ ...serif, ...btnReset, color: '#000' }}>
              (Back to images)
            </button>
          ) : (
            <button onClick={goToInfo} style={{ ...serif, ...btnReset, color: '#000' }}>
              (Read more)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
