import { config } from '$/config'
import { gsap, ScrollTrigger } from '@/gsap'
import type { ElementAnimation } from './types'
import {
	createScrollTriggerVars,
	resolveElementAnimationOverrides,
	toImmediateVars
} from './utils'

export const fadeUpRotate: ElementAnimation = (context) => {
	const { element, conditions } = context
	const overrides = resolveElementAnimationOverrides(context)
	const fromVars: gsap.TweenVars = {
		autoAlpha: 0,
		y: '2rem',
		...overrides.fromVars
	}
	const vars: gsap.TweenVars = {
		autoAlpha: 1,
		y: 0,
		duration: config.animation.default,
		ease: config.animation.ease.out,
		clearProps: 'transform',
		...overrides.vars
	}

	if (conditions.reduceMotion) {
		gsap.set(element, toImmediateVars(vars))
		return
	}

	gsap.registerPlugin(ScrollTrigger)
	gsap.set(element, fromVars)

	const tl = gsap.timeline({
		scrollTrigger: createScrollTriggerVars(element, overrides.scrollTrigger)
	})

	return tl
		.to(element, {
			...vars
		})
		.to(
			element,
			{
				rotate: 180,
				duration: config.animation.default * 2,
				ease: config.animation.ease.out
			},
			'<'
		)
}
