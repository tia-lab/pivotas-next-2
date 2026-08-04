import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'

export const ExpertiseIndexQuery = graphql(
	`
		query ExpertiseIndex($limit: Int = 12, $orderBy: String = "postDate DESC") {
			entries(section: "expertise", orderBy: $orderBy, limit: $limit) {
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
