import { fade } from './fade'
import { fadeUp } from './fade-up'
import { fadeUpRotate } from './fade-up-rotate'
import { imageReveal } from './image-reveal'

export const elementAnimations = {
	fade,
	'fade-up': fadeUp,
	'fade-up-rotate': fadeUpRotate,
	'image-reveal': imageReveal
} as const

export type ElementAnimationName = keyof typeof elementAnimations
