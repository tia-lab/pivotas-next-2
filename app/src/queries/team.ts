import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'

export const TeamIndexQuery = graphql(
	`
		query TeamIndex($limit: Int = 12, $orderBy: String = "title ASC") {
			entries(section: "teamMembers", orderBy: $orderBy, limit: $limit) {
				__typename
				id
				title
				uri
				... on teamMember_Entry {
					firstName
					lastName
					role
					slug
					expertiseLabel
					image {
						...AssetImageFragment
					}
				}
			}
		}
	`,
	[AssetImageFragment]
)
