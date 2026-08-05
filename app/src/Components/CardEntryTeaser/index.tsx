'use client'

import { config } from '$/config'
import { gsap } from '@/gsap'
import { useGsapMatchMedia } from '@/hooks'
import { formatDate } from '@/lib/craft/dates'
import clsx from 'clsx'
import { type ComponentProps, useEffect, useRef, useState } from 'react'
import { ImageCraft } from '../ImageCraft'
import { LinkArrow } from '../LinkArrow'
import $ from './style.module.scss'

export type CardEntryTeaserData = {
	date?: string | null
	id?: string | null
	image?: ComponentProps<typeof ImageCraft>['image']
	subtitle?: string | null
	title?: string | null
	uri?: string | null
}

export interface CardEntryTeaserProps {
	item: CardEntryTeaserData
	variant?: string | null
}

export const CardEntryTeaser = ({ item }: CardEntryTeaserProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const tl = useRef<gsap.core.Timeline | null>(null)
	const [hover, setHover] = useState(false)
	const href = item.uri
		? item.uri.startsWith('/')
			? item.uri
			: `/${item.uri}`
		: ''

	useGsapMatchMedia(
		config.context.isDesktop,
		() => {
			tl.current = gsap.timeline({
				paused: true,
				defaults: {
					duration: config.animation.default,
					ease: config.animation.ease.out
				}
			})

			const image = '[data-image]'
			const arrow = '[data-arrow]'
			tl.current.to(image, { scale: 1.15 }).to(arrow, { xPercent: 100 }, '<')
		},
		{ scope: ref }
	)

	useEffect(() => {
		if (tl.current) {
			hover ? tl.current.play() : tl.current.reverse()
		}
	}, [hover])

	return (
		<article className={clsx($.article)} data-entry-teaser-card ref={ref}>
			{item.image ? (
				<div className={$.image_wrapper} data-image-wrapper>
					<ImageCraft image={item.image} className={$.image} data-image />
				</div>
			) : null}

			<div
				data-card-content
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				className={clsx($.content)}>
				<div>
					{item.subtitle ? (
						<p className='text-caption'>{item.subtitle}</p>
					) : item.date ? (
						<p className='text-caption'>{formatDate(item.date)}</p>
					) : null}
					<h5 className={$.title}>{item.title}</h5>
				</div>
				<LinkArrow title='Read More' href={href} aria-label='Read More' />
			</div>
		</article>
	)
}
