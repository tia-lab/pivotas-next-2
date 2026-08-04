import { config } from '$/config'
import { Anim, Button, ImageCraft, Slider, Wrapper } from '@/Components'
import { formatDate } from '@/lib/craft/dates'
import { Footer } from '@/Sections/Footer'
import { EntryByUriQuery } from '@/queries'
import clsx from 'clsx'
import type { ResultOf } from 'gql.tada'
import $ from './style.module.scss'

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>['entry']>
type EventEntry = Extract<Entry, { __typename: 'event_Entry' }>

type Props = {
	entry: EventEntry
}

const formatEventDates = (
	startDate?: string | null,
	endDate?: string | null
) => {
	if (!startDate) {
		return null
	}

	const start = formatDate(startDate)
	const end = endDate ? formatDate(endDate) : null

	return end && end !== start ? `${start} – ${end}` : start
}

export const EventTemplate = ({ entry }: Props) => {
	const image = entry.image[0] ?? null
	const authorEntry = entry.entryAuthor[0]
	const author =
		authorEntry?.__typename === 'teamMember_Entry' ? authorEntry : null
	const gallery = entry.gallery.flatMap((galleryImage) =>
		galleryImage ? [galleryImage] : []
	)
	const eventDates = formatEventDates(entry.eventDate, entry.eventEndDate)

	return (
		<>
			<article className={$.section}>
				<Wrapper container>
					<div className={$.head}>
						{entry.caption ? (
							<Anim.div
								className='text-caption'
								dangerouslySetInnerHTML={{ __html: entry.caption }}
							/>
						) : null}
						<Anim.h1 type='fade-up'>{entry.title}</Anim.h1>
						{entry.subtitle ? (
							<Anim.p
								className={$.subtitle}
								type='fade-up'
								vars={{ delay: config.animation.short / 1.5 }}>
								{entry.subtitle}
							</Anim.p>
						) : null}
						{eventDates || author ? (
							<Anim.div
								className={$.meta}
								type='fade-up'
								vars={{ delay: config.animation.short }}>
								{eventDates ? <time>{eventDates}</time> : null}
								{author ? (
									<span>
										{[author.firstName, author.lastName].filter(Boolean).join(' ')}
										{author.role ? `, ${author.role}` : ''}
									</span>
								) : null}
							</Anim.div>
						) : null}
					</div>

					{image ? (
						<Anim.div
							className={$.hero_image}
							type='fade'
							vars={{ delay: config.animation.short }}>
							<ImageCraft className={$.image} image={image} sizes='100vw' />
						</Anim.div>
					) : null}

					{entry.richText?.html ? (
						<Anim.div
							className={clsx('rich-text', $.text)}
							dangerouslySetInnerHTML={{ __html: entry.richText.html }}
							type='fade-up'
						/>
					) : null}

					{gallery.length ? (
						<div className={$.gallery}>
							<Slider
								controls
								dots
								gap='0.25rem'
								slideSize='min(85vw, 46rem)'>
								{gallery.map((galleryImage, index) => (
									<div className={$.gallery_image} key={index}>
										<ImageCraft
											className={$.image}
											image={galleryImage}
											sizes='(max-width: 768px) 85vw, 46rem'
										/>
									</div>
								))}
							</Slider>
						</div>
					) : null}

					{entry.relatedLinks.length ? (
						<div className={$.related_links}>
							{entry.relatedLinks.map((group) => {
								if (group?.__typename !== 'relatedLink_Entry') {
									return null
								}

								return (
									<section className={$.related_link_group} key={group.id ?? group.title}>
										{group.title ? <h2 className='title-h4'>{group.title}</h2> : null}
										{group.subtitle ? <p>{group.subtitle}</p> : null}
										{group.links.length ? (
											<div className={$.links}>
												{group.links.map((link, index) => (
													<Button
														arrow
														key={index}
														link={link}
														transition='fade'
														variant='outline'
													/>
												))}
											</div>
										) : null}
									</section>
								)
							})}
						</div>
					) : null}
				</Wrapper>
			</article>

			<Footer />
		</>
	)
}
