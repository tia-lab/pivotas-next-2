import { craftQuery } from '@/lib/craft/client'
import { TeamIndexQuery } from '@/queries'

export type TeamOrder =
	| 'firstNameAsc'
	| 'firstNameDesc'
	| 'lastNameAsc'
	| 'lastNameDesc'

const teamOrderBy: Record<TeamOrder, string> = {
	firstNameAsc: 'firstName ASC',
	firstNameDesc: 'firstName DESC',
	lastNameAsc: 'lastName ASC',
	lastNameDesc: 'lastName DESC'
}

export const getTeam = (limit = 12, order: TeamOrder = 'firstNameAsc') => {
	return craftQuery(
		TeamIndexQuery,
		{ limit, orderBy: teamOrderBy[order] },
		{
			tags: [
				'craft',
				'craft:entries',
				'craft:team',
				'craft:section:teamMembers'
			],
			revalidate: false
		}
	)
}
