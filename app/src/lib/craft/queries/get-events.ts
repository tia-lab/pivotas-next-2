import { craftQuery } from '@/lib/craft/client'
import { EventsIndexQuery } from '@/queries'

export type EventsOrder = 'newest' | 'oldest' | 'titleAsc' | 'titleDesc'
export type EventsScope = 'all' | 'upcoming' | 'past'

const eventsOrderBy: Record<EventsOrder, string> = {
	newest: 'eventDate DESC',
	oldest: 'eventDate ASC',
	titleAsc: 'title ASC',
	titleDesc: 'title DESC'
}

const eventsDate: Record<Exclude<EventsScope, 'all'>, string[]> = {
	upcoming: ['>= now'],
	past: ['< now']
}

export const getEvents = (
	limit: number | null = 12,
	order: EventsOrder = 'newest',
	scope: EventsScope = 'all',
	offset = 0
) => {
	return craftQuery(
		EventsIndexQuery,
		{
			limit,
			offset,
			orderBy: eventsOrderBy[order],
			eventDate: scope === 'all' ? undefined : eventsDate[scope]
		},
		{
			tags: ['craft', 'craft:entries', 'craft:events', 'craft:section:events'],
			revalidate: scope === 'all' ? false : 3600
		}
	)
}
