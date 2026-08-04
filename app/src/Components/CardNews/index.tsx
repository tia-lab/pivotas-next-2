import { NewsIndexQuery } from '@/queries'
import type { ResultOf } from 'gql.tada'
import { CardEntryTeaser } from '../CardEntryTeaser'

type NewsCardData = Extract<
	NonNullable<NonNullable<ResultOf<typeof NewsIndexQuery>['entries']>[number]>,
	{ __typename: 'news_Entry' }
>

export interface CardNewsProps {
	item: NewsCardData
	variant?: string | null
}

export const CardNews = ({ item, variant }: CardNewsProps) => (
	<CardEntryTeaser
		item={{
			date: item.postDate,
			id: item.id,
			image: item.image?.[0] ?? null,
			title: item.title,
			uri: item.uri
		}}
		variant={variant}
	/>
)
