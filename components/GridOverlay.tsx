'use client'

import { useEffect, useState } from 'react'

export function GridOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div className="grid grid-cols-12 gap-4 h-full px-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-blue-500/10 border-x border-blue-500/20 h-full"
          />
        ))}
      </div>
    </div>
  )
}
