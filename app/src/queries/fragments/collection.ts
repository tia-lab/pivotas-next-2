import { graphql } from '@/lib/craft/graphql'

export const CollectionPageConfigFragment = graphql(`
	fragment CollectionPageConfigFragment on collectionPage_Entry {
		collection {
			... on newsCollection_Entry {
				__typename
				id
				collectionItemsLimit
				collectionItemsPerPage
				collectionOrderBy
			}
			... on eventsCollection_Entry {
				__typename
				id
				collectionItemsLimit
				collectionItemsPerPage
				collectionOrderBy
				eventsScope
			}
			... on expertiseCollection_Entry {
				__typename
				id
				collectionItemsLimit
				collectionItemsPerPage
				expertiseOrderBy
			}
			... on teamCollection_Entry {
				__typename
				id
				collectionItemsLimit
				collectionItemsPerPage
				teamOrderBy
				teamCategories {
					__typename
					id
					title
					slug
				}
			}
		}
	}
`)
