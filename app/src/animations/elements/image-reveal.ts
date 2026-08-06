import { config } from '$/config'
import { gsap, ScrollTrigger } from '@/gsap'
import type { ElementAnimation } from './types'
import {
	createScrollTriggerVars,
	resolveElementAnimationOverrides,
	toImmediateVars
} from './utils'

export const imageReveal: ElementAnimation = (context) => {
	const { element, conditions } = context
	const overrides = resolveElementAnimationOverrides(context)
	const image = element.querySelector('img') as HTMLImageElement | null
	const fromVars: gsap.TweenVars = {
		autoAlpha: 0,
		scale: 1.15,
		...overrides.fromVars
	}
	const vars: gsap.TweenVars = {
		autoAlpha: 1,
		scale: 1,
		duration: config.animation.long,
		ease: config.animation.ease.out,
		...overrides.vars
	}

	if (conditions.reduceMotion) {
		gsap.set(image, toImmediateVars(vars))
		return
	}

	gsap.registerPlugin(ScrollTrigger)
	gsap.set(image, fromVars)

	return gsap.to(image, {
		...vars,
		scrollTrigger: createScrollTriggerVars(element, {
			start: 'top bottom',
			...overrides.scrollTrigger
		})
	})
}
