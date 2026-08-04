import { CardEvent } from '@/Components'
import { getEvents, type EventsOrder } from '@/lib/craft/queries'
import { EventsIndexQuery, RenderableSectionFragment } from '@/queries'
import type { FragmentOf, ResultOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import {
	normalizeEntryLimit,
	normalizeEntryOrder,
	SectionEntryList,
	type SectionEntryListLink
} from '../utils/section-entry-list'
import type { SectionSpacingSource } from '../utils/section-spacing'

type SectionEventsEntry = Extract<
	FragmentOf<typeof RenderableSectionFragment>,
	{ __typename?: 'sectionEvents_Entry' }
>
type SelectedEventItem = NonNullable<
	NonNullable<SectionEventsEntry['selectedEvents']>[number]
>
type FallbackEventItem = NonNullable<
	NonNullable<ResultOf<typeof EventsIndexQuery>['entries']>[number]
>
type EventItemSource = SelectedEventItem | FallbackEventItem
type EventItem = Extract<EventItemSource, { __typename: 'event_Entry' }>

const normalizeOrder = (value: unknown): EventsOrder => {
	return normalizeEntryOrder(value)
}

const isEventItem = (item: unknown): item is EventItem => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item as { __typename?: string }).__typename === 'event_Entry'
	)
}

const SectionEventsFallback = async ({
	caption,
	links,
	limit,
	order,
	sectionId,
	spacingSource,
	title,
	typeHandle,
	variant
}: {
	caption?: string | null
	links?: ReadonlyArray<SectionEntryListLink | null> | null
	limit: number
	order: EventsOrder
	sectionId?: string | null
	spacingSource: SectionSpacingSource
	title?: string | null
	typeHandle?: string | null
	variant?: string | null
}) => {
	const data = await getEvents(limit, order)
	const items = (data.entries?.filter(isEventItem) ?? []) as EventItem[]

	return (
		<SectionEntryList
			caption={caption}
			items={items}
			links={links}
			renderItem={(item) => (
				<CardEvent key={item.id ?? item.uri} item={item} variant={variant} />
			)}
			sectionId={sectionId}
			spacingSource={spacingSource}
			title={title}
			typeHandle={typeHandle}
			variant={variant}
		/>
	)
}

export const SectionEvents = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionEvents_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const selectedEvents = (data.selectedEvents?.filter(isEventItem) ??
		[]) as EventItem[]
	const commonProps = {
		caption: data.caption,
		links: data.links,
		sectionId: data.id,
		spacingSource,
		title: data.title,
		typeHandle: data.typeHandle,
		variant: data.newsVariant
	}

	if (selectedEvents.length) {
		return (
			<SectionEntryList
				{...commonProps}
				items={selectedEvents}
				renderItem={(item) => (
					<CardEvent
						key={item.id ?? item.uri}
						item={item}
						variant={data.newsVariant}
					/>
				)}
			/>
		)
	}

	return (
		<SectionEventsFallback
			{...commonProps}
			limit={normalizeEntryLimit(data.itemsLimit)}
			order={normalizeOrder(data.orderBy)}
		/>
	)
}
