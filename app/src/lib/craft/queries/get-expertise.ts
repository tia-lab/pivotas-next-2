import { craftQuery } from '@/lib/craft/client'
import { ExpertiseIndexQuery } from '@/queries'

export type ExpertiseOrder = 'newest' | 'oldest'

const expertiseOrderBy: Record<ExpertiseOrder, string> = {
	newest: 'postDate DESC',
	oldest: 'postDate ASC'
}

export const getExpertise = (limit = 12, order: ExpertiseOrder = 'newest') => {
	return craftQuery(
		ExpertiseIndexQuery,
		{ limit, orderBy: expertiseOrderBy[order] },
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
