import { config } from '$/config'
import {
	Anim,
	Button,
	Container,
	ImageCraft,
	Parallax,
	Wrapper
} from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import type { FragmentOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import {
	getSectionSpacingStyle,
	type SectionSpacingSource
} from '../utils/section-spacing'
import $ from './style.module.scss'

interface SectionHeroProps extends React.HTMLAttributes<HTMLElement> {
	section?: FragmentOf<typeof RenderableSectionFragment> | null
	spacingOverride?: SectionSpacingSource | null
	fallbackTitle?: string | null
}

export const SectionHero = ({
	section,
	spacingOverride,
	fallbackTitle,
	style,
	...props
}: SectionHeroProps) => {
	const data = section ? readFragment(RenderableSectionFragment, section) : null

	if (data?.__typename !== 'sectionHero_Entry') {
		return null
	}

	const imageRef = data.image[0] ?? null
	const title = data.title || fallbackTitle
	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const spacingStyle = getSectionSpacingStyle(spacingSource)
	const sectionStyle =
		spacingStyle || style ? { ...spacingStyle, ...style } : undefined

	return (
		<section className={$.section} style={sectionStyle} {...props}>
			<Wrapper>
				<Container>
					<div className={$.title}>
						{title ? (
							<Anim.h1 type='fade-up' className='title-h2'>
								{title}
							</Anim.h1>
						) : null}
					</div>
					<div className={$.desc}>
						{data.description ? (
							<Anim.p type='fade-up' vars={{ delay: config.animation.short / 1.5 }}>
								{data.description}
							</Anim.p>
						) : null}
						<div className={$.line} />
					</div>
				</Container>
				<div className={$.spacer} />
				<Container>
					<div className={$.line_block}>
						{data.subtitle ? (
							<Anim.p
								type='fade-up'
								vars={{ delay: config.animation.short / 1.5 }}
								className={clsx('text-cpt', $.subtitle)}>
								{data.subtitle}
							</Anim.p>
						) : null}
						<Anim.div type='fade' className={$.line} />
					</div>
					{data.links?.length ? (
						<Anim.div type='fade-up' className={$.links}>
							{data.links.map((link, index) => {
								if (!link) {
									return null
								}

								return (
									<Button
										transition='fade'
										key={index}
										variant='white-outline'
										className={$.button}
										link={link}
										arrow={true}
									/>
								)
							})}
						</Anim.div>
					) : null}
				</Container>
			</Wrapper>
			<Parallax.div
				className={$.image}
				speed={2}
				fromVars={{ yPercent: -15, scale: 1.12 }}
				vars={{ yPercent: 10, scale: 1.04 }}>
				<ImageCraft
					image={imageRef}
					className={$.image_media}
					sizes='100vw'
					loading='eager'
					fetchPriority='high'
				/>
			</Parallax.div>
			<div className={$.image_overlay} />
		</section>
	)
}
