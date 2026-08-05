import {
	getEvents,
	getExpertise,
	getNews,
	getTeam,
	type EventsOrder,
	type EventsScope,
	type ExpertiseOrder,
	type NewsOrder,
	type TeamOrder
} from '@/lib/craft/queries'
import type {
	CollectionBatch,
	CollectionConfig,
	CollectionItem,
	EventItem,
	ExpertiseItem,
	NewsItem,
	TeamItem
} from './types'

const normalizeNonNegativeInteger = (value: unknown, fallback: number) => {
	const parsed = Number(value)

	return Number.isFinite(parsed) && parsed >= 0
		? Math.floor(parsed)
		: fallback
}

const normalizeItemsPerPage = (value: unknown) =>
	Math.min(normalizeNonNegativeInteger(value, 6), 24)

const normalizeCollectionOrder = (value: unknown): NewsOrder & EventsOrder => {
	if (
		value === 'oldest' ||
		value === 'titleAsc' ||
		value === 'titleDesc'
	) {
		return value
	}

	return 'newest'
}

const normalizeEventsScope = (value: unknown): EventsScope => {
	return value === 'upcoming' || value === 'past' ? value : 'all'
}

const normalizeExpertiseOrder = (value: unknown): ExpertiseOrder => {
	if (
		value === 'newest' ||
		value === 'oldest' ||
		value === 'titleAsc' ||
		value === 'titleDesc'
	) {
		return value
	}

	return 'structure'
}

const normalizeTeamOrder = (value: unknown): TeamOrder => {
	if (
		value === 'firstNameDesc' ||
		value === 'lastNameAsc' ||
		value === 'lastNameDesc'
	) {
		return value
	}

	return 'firstNameAsc'
}

const isNewsItem = (item: unknown): item is NewsItem =>
	(item as { __typename?: string } | null)?.__typename === 'news_Entry'

const isEventItem = (item: unknown): item is EventItem =>
	(item as { __typename?: string } | null)?.__typename === 'event_Entry'

const isExpertiseItem = (item: unknown): item is ExpertiseItem =>
	(item as { __typename?: string } | null)?.__typename === 'expertise_Entry'

const isTeamItem = (item: unknown): item is TeamItem =>
	(item as { __typename?: string } | null)?.__typename === 'teamMember_Entry'

type BatchRequest = {
	displayLimit: number | null
	requestLimit: number | null
}

const getBatchRequest = (
	totalLimit: number,
	itemsPerPage: number,
	offset: number
): BatchRequest | null => {
	const remaining = totalLimit === 0 ? null : Math.max(totalLimit - offset, 0)

	if (remaining === 0) {
		return null
	}

	if (itemsPerPage === 0) {
		return {
			displayLimit: null,
			requestLimit: remaining
		}
	}

	const displayLimit =
		remaining === null ? itemsPerPage : Math.min(itemsPerPage, remaining)
	const canHaveAnotherBatch = remaining === null || displayLimit < remaining

	return {
		displayLimit,
		requestLimit: displayLimit + (canHaveAnotherBatch ? 1 : 0)
	}
}

const createBatch = (
	config: CollectionConfig,
	offset: number,
	request: BatchRequest | null,
	entries: CollectionItem[]
): CollectionBatch => {
	const items =
		request?.displayLimit === null
			? entries
			: entries.slice(0, request?.displayLimit ?? 0)

	return {
		type: config.__typename,
		items,
		hasMore:
			request?.displayLimit !== null &&
			entries.length > (request?.displayLimit ?? 0),
		nextOffset: offset + items.length
	}
}

export const getCollectionBatch = async (
	config: CollectionConfig,
	offset = 0
): Promise<CollectionBatch> => {
	const safeOffset = normalizeNonNegativeInteger(offset, 0)
	const totalLimit = normalizeNonNegativeInteger(config.collectionItemsLimit, 0)
	const itemsPerPage = normalizeItemsPerPage(config.collectionItemsPerPage)
	const request = getBatchRequest(totalLimit, itemsPerPage, safeOffset)

	if (!request) {
		return createBatch(config, safeOffset, null, [])
	}

	switch (config.__typename) {
		case 'newsCollection_Entry': {
			const data = await getNews(
				request.requestLimit,
				normalizeCollectionOrder(config.collectionOrderBy),
				safeOffset
			)

			return createBatch(
				config,
				safeOffset,
				request,
				data.entries?.filter(isNewsItem) ?? []
			)
		}
		case 'eventsCollection_Entry': {
			const data = await getEvents(
				request.requestLimit,
				normalizeCollectionOrder(config.collectionOrderBy),
				normalizeEventsScope(config.eventsScope),
				safeOffset
			)

			return createBatch(
				config,
				safeOffset,
				request,
				data.entries?.filter(isEventItem) ?? []
			)
		}
		case 'expertiseCollection_Entry': {
			const data = await getExpertise(
				request.requestLimit,
				normalizeExpertiseOrder(config.expertiseOrderBy),
				safeOffset
			)

			return createBatch(
				config,
				safeOffset,
				request,
				data.entries?.filter(isExpertiseItem) ?? []
			)
		}
		case 'teamCollection_Entry': {
			const categoryIds =
				config.teamCategories
					?.map((category) => category?.id)
					.filter((id): id is string => Boolean(id)) ?? []
			const data = await getTeam(
				request.requestLimit,
				normalizeTeamOrder(config.teamOrderBy),
				categoryIds,
				safeOffset
			)

			return createBatch(
				config,
				safeOffset,
				request,
				data.entries?.filter(isTeamItem) ?? []
			)
		}
	}
}
