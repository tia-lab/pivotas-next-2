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

export const getTeam = (
	limit: number | null = 12,
	order: TeamOrder = 'firstNameAsc',
	categoryIds: string[] = [],
	offset = 0
) => {
	return craftQuery(
		TeamIndexQuery,
		{
			limit,
			offset,
			orderBy: teamOrderBy[order],
			teamCategories: categoryIds.length ? categoryIds : undefined
		},
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
