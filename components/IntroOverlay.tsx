'use client'

import { useState, useEffect, useRef } from 'react'
import { TRANSITION_MS, FADE_ANIMATION } from '@/lib/constants'

type Phase = 'visible' | 'fading' | 'gone'

const DISPLAY_MS = 2000
const TOTAL_MS   = DISPLAY_MS + TRANSITION_MS  // 2500

export default function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>('visible')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timersRef.current.push(setTimeout(() => setPhase('fading'), DISPLAY_MS))
    timersRef.current.push(setTimeout(() => setPhase('gone'),   TOTAL_MS))
    return () => { timersRef.current.forEach(clearTimeout) }
  }, [])

  const dismiss = () => {
    if (phase !== 'visible') return
    timersRef.current.forEach(clearTimeout)
    setPhase('fading')
    timersRef.current.push(setTimeout(() => setPhase('gone'), TRANSITION_MS))
  }

  if (phase === 'gone') return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#E8D9C4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        cursor: 'pointer',
        opacity: phase === 'fading' ? 0 : 1,
        transition: phase === 'fading' ? `opacity ${TRANSITION_MS}ms ease-in-out` : undefined,
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
          animation: phase === 'visible' ? 'fadein 1500ms ease-in-out' : undefined,
        }}
      >
        Jean Kwak Architects
      </h1>
      <span
        style={{
          fontFamily: 'QuadrantTextMono',
          fontWeight: 400,
          fontSize: 'var(--font-label)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          color: '#2B2B2B',
          animation: phase === 'visible' ? 'fadein 1500ms ease-in-out' : undefined,
        }}
      >
        (Click to enter)
      </span>
    </div>
  )
}
