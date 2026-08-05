'use server'

import { getCollectionPageById } from '@/lib/craft/queries'
import { CollectionPageConfigFragment } from '@/queries'
import type { FragmentOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import { getCollectionBatch } from './data'
import type { CollectionBatch, CollectionConfig } from './types'

const MAX_OFFSET = 100_000

const isCollectionConfig = (value: unknown): value is CollectionConfig => {
	const type = (value as { __typename?: string } | null)?.__typename

	return (
		type === 'newsCollection_Entry' ||
		type === 'eventsCollection_Entry' ||
		type === 'expertiseCollection_Entry' ||
		type === 'teamCollection_Entry'
	)
}

export const loadMoreCollection = async (
	entryId: string,
	offset: number
): Promise<CollectionBatch> => {
	if (!/^\d+$/.test(entryId)) {
		throw new Error('Invalid collection page.')
	}

	if (!Number.isInteger(offset) || offset < 0 || offset > MAX_OFFSET) {
		throw new Error('Invalid collection offset.')
	}

	const data = await getCollectionPageById(entryId)
	const entry = data.entry

	if (
		entry?.__typename !== 'collectionPage_Entry' ||
		entry.id !== entryId
	) {
		throw new Error('Collection page not found.')
	}

	const config = readFragment(
		CollectionPageConfigFragment,
		entry as FragmentOf<typeof CollectionPageConfigFragment>
	).collection?.[0]

	if (!isCollectionConfig(config)) {
		throw new Error('Collection configuration not found.')
	}

	return getCollectionBatch(config, offset)
}
