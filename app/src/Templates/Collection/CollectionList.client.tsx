'use client'

import { Button } from '@/Components/Button'
import { CardEvent } from '@/Components/CardEvent'
import { CardExpertise } from '@/Components/CardExpertise'
import { CardNews } from '@/Components/CardNews'
import { CardTeamMember } from '@/Components/CardTeamMember'
import { useState, useTransition } from 'react'
import { loadMoreCollection } from './actions'
import $ from './style.module.scss'
import type {
	CollectionBatch,
	CollectionItem
} from './types'

type Props = {
	entryId: string
	initialBatch: CollectionBatch
}

const renderItem = (item: CollectionItem) => {
	switch (item.__typename) {
		case 'news_Entry':
			return <CardNews key={item.id} item={item} />
		case 'event_Entry':
			return <CardEvent key={item.id} item={item} />
		case 'expertise_Entry':
			return <CardExpertise key={item.id} item={item} />
		case 'teamMember_Entry':
			return <CardTeamMember key={item.id} item={item} />
	}
}

const appendUniqueItems = (
	currentItems: CollectionItem[],
	nextItems: CollectionItem[]
) => {
	const ids = new Set(
		currentItems.map((item) => `${item.__typename}:${item.id}`)
	)

	return [
		...currentItems,
		...nextItems.filter(
			(item) => !ids.has(`${item.__typename}:${item.id}`)
		)
	]
}

export const CollectionList = ({ entryId, initialBatch }: Props) => {
	const [items, setItems] = useState(initialBatch.items)
	const [hasMore, setHasMore] = useState(initialBatch.hasMore)
	const [nextOffset, setNextOffset] = useState(initialBatch.nextOffset)
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	const loadMore = () => {
		setError(null)

		startTransition(async () => {
			try {
				const batch = await loadMoreCollection(entryId, nextOffset)

				if (batch.type !== initialBatch.type) {
					throw new Error('Collection type changed.')
				}

				setItems((currentItems) =>
					appendUniqueItems(currentItems, batch.items)
				)
				setHasMore(batch.hasMore)
				setNextOffset(batch.nextOffset)
			} catch {
				setError('More items could not be loaded. Please try again.')
			}
		})
	}

	return (
		<>
			<div
				className={$.grid}
				data-collection-type={initialBatch.type}>
				{items.map(renderItem)}
			</div>
			{hasMore ? (
				<div className={$.load_more}>
					<Button
						onClick={loadMore}
						disabled={isPending}
						aria-label='Load more collection items'>
						{isPending ? 'Loading…' : 'Load more'}
					</Button>
				</div>
			) : null}
			<p className={$.status} role={error ? 'alert' : 'status'} aria-live='polite'>
				{error}
			</p>
		</>
	)
}
