import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'

export const EventsIndexQuery = graphql(
	`
		query EventsIndex(
			$limit: Int
			$offset: Int = 0
			$orderBy: String = "eventDate DESC"
			$eventDate: [QueryArgument]
		) {
			entries(
				section: "events"
				orderBy: $orderBy
				limit: $limit
				offset: $offset
				eventDate: $eventDate
			) {
				__typename
				id
				title
				uri
				... on event_Entry {
					eventDate
					eventEndDate
					subtitle
					image {
						...AssetImageFragment
					}
				}
			}
		}
	`,
	[AssetImageFragment]
)
