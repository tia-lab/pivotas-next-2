import { Wrapper } from '@/Components'
import { CollectionPageConfigFragment } from '@/queries'
import { Footer } from '@/Sections/Footer'
import type { FragmentOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import { CollectionList } from './CollectionList.client'
import { getCollectionBatch } from './data'
import $ from './style.module.scss'
import type { CollectionEntry } from './types'

type Props = {
	entry: CollectionEntry
}

export const CollectionTemplate = async ({ entry }: Props) => {
	const config = readFragment(
		CollectionPageConfigFragment,
		entry as FragmentOf<typeof CollectionPageConfigFragment>
	).collection?.[0]
	const initialBatch = config ? await getCollectionBatch(config) : null

	return (
		<>
			<main>
				<section className={$.section}>
					<Wrapper>
						<h1 className={$.title}>{entry.title}</h1>
						{entry.id && initialBatch ? (
							<CollectionList
								key={entry.id}
								entryId={entry.id}
								initialBatch={initialBatch}
							/>
						) : null}
					</Wrapper>
				</section>
			</main>
			<Footer />
		</>
	)
}
