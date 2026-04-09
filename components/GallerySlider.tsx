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
        className="w-full block"
      />
      <div className="flex justify-between items-center py-2 text-xs text-black/60">
        <span>{current.caption ?? ''}</span>
        {total > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
              className="disabled:opacity-30 cursor-pointer"
            >
              ←
            </button>
            <span>{index + 1}/{total}</span>
            <button
              onClick={() => setIndex(i => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              className="disabled:opacity-30 cursor-pointer"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
