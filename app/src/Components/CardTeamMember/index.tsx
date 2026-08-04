'use client'

import { config } from '$/config'
import { gsap } from '@/gsap'
import { useGsapMatchMedia } from '@/hooks'
import { TeamIndexQuery } from '@/queries'
import clsx from 'clsx'
import { ResultOf } from 'gql.tada'
import { useEffect, useRef, useState } from 'react'
import { ImageCraft } from '../ImageCraft'
import { LinkArrow } from '../LinkArrow'
import { TransitionLink } from '../TransitionLink'
import $ from './style.module.scss'

type TeamCardData = Extract<
	NonNullable<NonNullable<ResultOf<typeof TeamIndexQuery>['entries']>[number]>,
	{ __typename: 'teamMember_Entry' }
>

export interface CardTeamMemberProps {
	item: TeamCardData
}

export const CardTeamMember = ({ item }: CardTeamMemberProps) => {
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
			{item.image?.[0] ? (
				<div className={$.image_wrapper} data-image-wrapper>
					<ImageCraft image={item.image[0]} className={$.image} data-image />
				</div>
			) : null}
			<TransitionLink href={'/team/' + item.slug} className={clsx($.link)}>
				<div
					data-card-content
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
					className={clsx($.content)}>
					<div className={clsx($.badge, 'text-button')}>{item.expertiseLabel}</div>
					<div>
						{item.firstName ? <div className='title-h4'>{item.firstName}</div> : null}
						{item.lastName ? <div className='title-h4'>{item.lastName}</div> : null}
					</div>
					<h5 className={clsx('text-button')}>{item.role}</h5>
					{href ? (
						<LinkArrow title='Read More' href={href} aria-label='Read More' />
					) : null}
				</div>
			</TransitionLink>
		</article>
	)
}
