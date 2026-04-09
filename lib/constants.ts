export const TRANSITION_MS = 500
export const TRANSITION_EASING = 'ease-in-out'

/** CSS transition shorthand for use in inline style strings, e.g. `opacity ${TRANSITION}` */
export const TRANSITION = `${TRANSITION_MS}ms ${TRANSITION_EASING}`

/** CSS animation value for the fadein keyframe */
export const FADE_ANIMATION = `fadein ${TRANSITION_MS}ms ${TRANSITION_EASING}`

/** Delay before auto-advancing from the title slide to the first image */
export const TITLE_SLIDE_DELAY_MS = 3000
