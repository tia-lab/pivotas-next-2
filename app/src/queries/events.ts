import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'

export const EventsIndexQuery = graphql(
	`
		query EventsIndex($limit: Int = 12, $orderBy: String = "eventDate DESC") {
			entries(section: "events", orderBy: $orderBy, limit: $limit) {
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
