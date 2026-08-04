import { EventsIndexQuery } from '@/queries'
import type { ResultOf } from 'gql.tada'
import { CardEntryTeaser } from '../CardEntryTeaser'

type EventCardData = Extract<
	NonNullable<
		NonNullable<ResultOf<typeof EventsIndexQuery>['entries']>[number]
	>,
	{ __typename: 'event_Entry' }
>

export interface CardEventProps {
	item: EventCardData
	variant?: string | null
}

export const CardEvent = ({ item, variant }: CardEventProps) => (
	<CardEntryTeaser
		item={{
			id: item.id,
			image: item.image?.[0] ?? null,
			subtitle: item.subtitle,
			title: item.title,
			uri: item.uri
		}}
		variant={variant}
	/>
)
