'use client'

import { config } from '$/config'
import { gsap } from '@/gsap'
import { useGsapMatchMedia } from '@/hooks'
import { ExpertiseIndexQuery } from '@/queries'
import clsx from 'clsx'
import type { ResultOf } from 'gql.tada'
import { useEffect, useRef, useState } from 'react'
import { ImageCraft } from '../ImageCraft'
import { LinkArrow } from '../LinkArrow'
import $ from './style.module.scss'

type ExpertiseCardData = Extract<
	NonNullable<
		NonNullable<ResultOf<typeof ExpertiseIndexQuery>['entries']>[number]
	>,
	{ __typename: 'expertise_Entry' }
>

interface ExpertiseCardProps {
	item: ExpertiseCardData
	variant?: string | null
}

export const CardExpertise = ({ item, variant }: ExpertiseCardProps) => {
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
		<article
			className={clsx($.article, variant === 'slider' && $.is_slider)}
			ref={ref}>
			{item.image?.[0] ? (
				<div className={$.image_wrapper}>
					<ImageCraft image={item.image[0]} className={$.image} data-image />
				</div>
			) : null}

			<div
				data-card-content
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				className={clsx($.content)}>
				<h4 className={$.title}>{item.title}</h4>
				<LinkArrow title='Discover our expertise' href={href} />
			</div>
		</article>
	)
}
