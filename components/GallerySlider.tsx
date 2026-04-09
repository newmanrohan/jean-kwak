'use client'

import { useState } from 'react'
import { urlFor } from '@/lib/sanity'

interface ProjectImage {
  image: {
    asset: { _ref: string }
  }
  caption?: string
}

interface GallerySliderProps {
  images: ProjectImage[]
}

export default function GallerySlider({ images }: GallerySliderProps) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) return <p>No images</p>

  const total = images.length
  const current = images[index]
  const url = urlFor(current.image).width(1400).url()

  return (
    <div>
      <img
        src={url}
        alt={current.caption ?? ''}
        style={{ width: '100%', display: 'block' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px' }}>
        <span>{current.caption ?? ''}</span>
        <span>
          {total > 1 && (
            <>
              <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0} style={{ marginRight: 8 }}>←</button>
              {index + 1} / {total}
              <button onClick={() => setIndex(i => Math.min(total - 1, i + 1))} disabled={index === total - 1} style={{ marginLeft: 8 }}>→</button>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
