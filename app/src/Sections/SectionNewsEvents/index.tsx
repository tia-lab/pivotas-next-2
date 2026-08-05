import { Anim, Button, CardEvent, CardNews, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import { readFragment } from 'gql.tada'
import type { ComponentProps } from 'react'
import type { SectionComponentProps } from '../SectionRouter'
import { getSectionSpacingStyle } from '../utils/section-spacing'
import $ from './style.module.scss'

type NewsItem = ComponentProps<typeof CardNews>['item']
type EventItem = ComponentProps<typeof CardEvent>['item']

const maxNewsItems = 2
const maxEventItems = 3

const isNewsItem = (item: unknown): item is NewsItem => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item as { __typename?: string }).__typename === 'news_Entry'
	)
}

const isEventItem = (item: unknown): item is EventItem => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item as { __typename?: string }).__typename === 'event_Entry'
	)
}

export const SectionNewsEvents = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionNewsEvents_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const selectedNews = (data.selectedNews?.filter(isNewsItem) ?? []).slice(
		0,
		maxNewsItems
	) as NewsItem[]
	const selectedEvents = (data.selectedEvents?.filter(isEventItem) ?? []).slice(
		0,
		maxEventItems
	) as EventItem[]

	if (!selectedNews.length && !selectedEvents.length) {
		return null
	}

	return (
		<section
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			style={getSectionSpacingStyle(spacingSource)}
			className={$.section}>
			<Wrapper>
				<Anim.h2 className={clsx($.title)}>{data.title}</Anim.h2>
				<div className={clsx($.grid, $.is_news)}>
					{selectedNews.map((item) => (
						<CardNews key={item.id ?? item.uri} item={item} data-card />
					))}
				</div>
				<div className={$.grid}>
					{selectedEvents.map((item) => (
						<CardEvent key={item.id ?? item.uri} item={item} data-card />
					))}
				</div>
				{data.links.length ? (
					<div className={clsx($.links)}>
						{data.links.map((link, index) => (
							<Button
								key={index}
								link={link}
								arrow={true}
								variant='outline'
								transition='fade'
							/>
						))}
					</div>
				) : null}
			</Wrapper>
		</section>
	)
}
