import { craftQuery } from '@/lib/craft/client'
import { ExpertiseIndexQuery } from '@/queries'

export type ExpertiseOrder =
	| 'structure'
	| 'newest'
	| 'oldest'
	| 'titleAsc'
	| 'titleDesc'

const expertiseOrderBy: Record<ExpertiseOrder, string> = {
	structure: 'lft ASC',
	newest: 'postDate DESC',
	oldest: 'postDate ASC',
	titleAsc: 'title ASC',
	titleDesc: 'title DESC'
}

export const getExpertise = (
	limit: number | null = 12,
	order: ExpertiseOrder = 'newest',
	offset = 0
) => {
	return craftQuery(
		ExpertiseIndexQuery,
		{ limit, offset, orderBy: expertiseOrderBy[order] },
		{
			tags: [
				'craft',
				'craft:entries',
				'craft:expertise',
				'craft:section:expertise'
			],
			revalidate: false
		}
	)
}
