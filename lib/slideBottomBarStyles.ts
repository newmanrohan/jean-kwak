import type { CSSProperties } from 'react'

/** Mono counter: `1 / N` — shared by homepage ProjectSlider and project ProjectSlideShow */
export const slideBarCounterStyle: CSSProperties = {
  fontFamily: 'QuadrantTextMono',
  fontWeight: 400,
  fontSize: 'var(--font-label)',
  letterSpacing: '0.03em',
  lineHeight: '1.18',
  color: '#000',
}

/** Body caption to the right of the counter (20px gap applied on the caption span) */
export const slideBarCaptionStyle: CSSProperties = {
  fontFamily: 'QuadrantText',
  fontWeight: 200,
  fontSize: 'var(--font-body)',
  color: '#000',
  marginLeft: '20px',
}
