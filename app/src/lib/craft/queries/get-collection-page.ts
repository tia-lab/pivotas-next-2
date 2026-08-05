import { craftQuery, normalizeCraftCacheTags } from '@/lib/craft/client'
import { CollectionPageByIdQuery } from '@/queries'

export const getCollectionPageById = (id: string) => {
	return craftQuery(
		CollectionPageByIdQuery,
		{ id: [id] },
		{
			tags: normalizeCraftCacheTags([
				'craft',
				'craft:entries',
				'craft:pages',
				`craft:entry-id:${id}`
			]),
			revalidate: false
		}
	)
}
