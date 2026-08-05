import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'

export const TeamIndexQuery = graphql(
	`
		query TeamIndex(
			$limit: Int
			$offset: Int = 0
			$orderBy: String = "title ASC"
			$teamCategories: [QueryArgument]
		) {
			entries(
				section: "teamMembers"
				orderBy: $orderBy
				limit: $limit
				offset: $offset
				teamCategories: $teamCategories
			) {
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
