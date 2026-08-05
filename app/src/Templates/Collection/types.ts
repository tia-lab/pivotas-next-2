import {
	CollectionPageConfigFragment,
	EntryByUriQuery,
	EventsIndexQuery,
	ExpertiseIndexQuery,
	NewsIndexQuery,
	TeamIndexQuery
} from '@/queries'
import type { ResultOf } from 'gql.tada'

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>['entry']>

export type CollectionEntry = Extract<
	Entry,
	{ __typename: 'collectionPage_Entry' }
>
export type CollectionConfig = NonNullable<
	NonNullable<
		ResultOf<typeof CollectionPageConfigFragment>['collection']
	>[number]
>
export type CollectionType = NonNullable<CollectionConfig['__typename']>

export type NewsItem = Extract<
	NonNullable<NonNullable<ResultOf<typeof NewsIndexQuery>['entries']>[number]>,
	{ __typename: 'news_Entry' }
>
export type EventItem = Extract<
	NonNullable<NonNullable<ResultOf<typeof EventsIndexQuery>['entries']>[number]>,
	{ __typename: 'event_Entry' }
>
export type ExpertiseItem = Extract<
	NonNullable<
		NonNullable<ResultOf<typeof ExpertiseIndexQuery>['entries']>[number]
	>,
	{ __typename: 'expertise_Entry' }
>
export type TeamItem = Extract<
	NonNullable<NonNullable<ResultOf<typeof TeamIndexQuery>['entries']>[number]>,
	{ __typename: 'teamMember_Entry' }
>

export type CollectionItem = NewsItem | EventItem | ExpertiseItem | TeamItem

export type CollectionBatch = {
	type: CollectionType
	items: CollectionItem[]
	hasMore: boolean
	nextOffset: number
}
