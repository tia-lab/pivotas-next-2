import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'

export const ExpertiseIndexQuery = graphql(
	`
		query ExpertiseIndex(
			$limit: Int
			$offset: Int = 0
			$orderBy: String = "postDate DESC"
		) {
			entries(
				section: "expertise"
				orderBy: $orderBy
				limit: $limit
				offset: $offset
			) {
				__typename
				id
				title
				uri
				... on expertise_Entry {
					postDate
					image {
						...AssetImageFragment
					}
				}
			}
		}
	`,
	[AssetImageFragment]
)
