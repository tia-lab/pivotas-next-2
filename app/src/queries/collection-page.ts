import { graphql } from '@/lib/craft/graphql'
import { CollectionPageConfigFragment } from './fragments/collection'

export const CollectionPageByIdQuery = graphql(
	`
		query CollectionPageById($id: [QueryArgument]) {
			entry(id: $id, type: "collectionPage") {
				__typename
				id
				... on collectionPage_Entry {
					...CollectionPageConfigFragment
				}
			}
		}
	`,
	[CollectionPageConfigFragment]
)
