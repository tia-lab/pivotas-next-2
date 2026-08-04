import { craftQuery } from '@/lib/craft/client'
import { EventsIndexQuery } from '@/queries'

export type EventsOrder = 'newest' | 'oldest'

const eventsOrderBy: Record<EventsOrder, string> = {
	newest: 'eventDate DESC',
	oldest: 'eventDate ASC'
}

export const getEvents = (limit = 12, order: EventsOrder = 'newest') => {
	return craftQuery(
		EventsIndexQuery,
		{ limit, orderBy: eventsOrderBy[order] },
		{
			tags: ['craft', 'craft:entries', 'craft:events', 'craft:section:events'],
			revalidate: false
		}
	)
}
