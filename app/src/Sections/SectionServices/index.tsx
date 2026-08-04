import { RenderableSectionFragment } from '@/queries'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import { ListSectionView } from '../SectionList'

const isServiceItem = (
	item: unknown
): item is { description?: string | null; id?: string | null; title?: string | null } =>
	typeof item === 'object' &&
	item !== null &&
	(item as { __typename?: string }).__typename === 'service_Entry'

export const SectionServices = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionServices_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const items = (data.selectedServices ?? []).flatMap((item) =>
		isServiceItem(item)
			? [
					{
						description: item.description,
						id: item.id,
						title: item.title
					}
				]
			: []
	)

	return (
		<ListSectionView
			caption={data.caption}
			items={items}
			sectionId={data.id}
			spacingSource={spacingSource}
			title={data.title}
			typeHandle={data.typeHandle}
		/>
	)
}
