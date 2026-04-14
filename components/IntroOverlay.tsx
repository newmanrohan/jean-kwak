'use client'

import { useState, useEffect } from 'react'
import { TRANSITION_MS, FADE_ANIMATION } from '@/lib/constants'

type Phase = 'visible' | 'fading' | 'gone'

const DISPLAY_MS = 2000
const TOTAL_MS   = DISPLAY_MS + TRANSITION_MS  // 2500

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>('visible')

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fading'), DISPLAY_MS)
    const doneTimer = setTimeout(() => setPhase('gone'),   TOTAL_MS)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#E8D9C4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'fading' ? 0 : 1,
        animation: phase === 'visible' ? FADE_ANIMATION : undefined,
        transition: phase === 'fading'
          ? `opacity ${TRANSITION_MS}ms ease-in-out`
          : undefined,
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
        Jean Kwak Architects
      </h1>
    </div>
  )
}
