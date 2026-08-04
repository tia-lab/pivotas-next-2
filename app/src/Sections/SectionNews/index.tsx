import { CardNews } from '@/Components'
import { getNews, type NewsOrder } from '@/lib/craft/queries'
import { NewsIndexQuery, RenderableSectionFragment } from '@/queries'
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

type SectionNewsEntry = Extract<
	FragmentOf<typeof RenderableSectionFragment>,
	{ __typename?: 'sectionNews_Entry' }
>
type SelectedNewsItem = NonNullable<
	NonNullable<SectionNewsEntry['selectedNews']>[number]
>
type FallbackNewsItem = NonNullable<
	NonNullable<ResultOf<typeof NewsIndexQuery>['entries']>[number]
>
type NewsItemSource = SelectedNewsItem | FallbackNewsItem
type NewsItem = Extract<NewsItemSource, { __typename: 'news_Entry' }>

const normalizeOrder = (value: unknown): NewsOrder => {
	return normalizeEntryOrder(value)
}

const isNewsItem = (item: unknown): item is NewsItem => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item as { __typename?: string }).__typename === 'news_Entry'
	)
}

const SectionNewsFallback = async ({
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
	order: NewsOrder
	sectionId?: string | null
	spacingSource: SectionSpacingSource
	title?: string | null
	typeHandle?: string | null
	variant?: string | null
}) => {
	const data = await getNews(limit, order)
	const items = (data.entries?.filter(isNewsItem) ?? []) as NewsItem[]

	return (
		<SectionEntryList
			caption={caption}
			items={items}
			links={links}
			renderItem={(item) => (
				<CardNews key={item.id ?? item.uri} item={item} variant={variant} />
			)}
			sectionId={sectionId}
			spacingSource={spacingSource}
			title={title}
			typeHandle={typeHandle}
			variant={variant}
		/>
	)
}

export const SectionNews = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionNews_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const selectedNews = (data.selectedNews?.filter(isNewsItem) ??
		[]) as NewsItem[]

	const commonProps = {
		caption: data.caption,
		links: data.links,
		sectionId: data.id,
		spacingSource,
		title: data.title,
		typeHandle: data.typeHandle,
		variant: data.newsVariant
	}

	if (selectedNews.length) {
		return (
			<SectionEntryList
				{...commonProps}
				items={selectedNews}
				renderItem={(item) => (
					<CardNews key={item.id ?? item.uri} item={item} variant={data.newsVariant} />
				)}
			/>
		)
	}

	return (
		<SectionNewsFallback
			{...commonProps}
			limit={normalizeEntryLimit(data.itemsLimit)}
			order={normalizeOrder(data.orderBy)}
		/>
	)
}
