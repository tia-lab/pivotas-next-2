import { fade } from './fade'
import { fadeUp } from './fade-up'
import { fadeUpRotate } from './fade-up-rotate'

export const elementAnimations = {
	fade,
	'fade-up': fadeUp,
	'fade-up-rotate': fadeUpRotate
} as const

export type ElementAnimationName = keyof typeof elementAnimations
