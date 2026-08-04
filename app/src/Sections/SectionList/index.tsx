import { Anim, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import {
	getSectionSpacingStyle,
	type SectionSpacingSource
} from '../utils/section-spacing'
import $ from './style.module.scss'

export type ListSectionItem = {
	description?: string | null
	id?: string | null
	title?: string | null
}

export type ListSectionViewProps = {
	caption?: string | null
	items: ListSectionItem[]
	sectionId?: string | null
	spacingSource: SectionSpacingSource
	title?: string | null
	typeHandle?: string | null
}

const isListItem = (
	item: unknown
): item is { description?: string | null; id?: string | null; title?: string | null } =>
	typeof item === 'object' &&
	item !== null &&
	(item as { __typename?: string }).__typename === 'listItem_Entry'

export const ListSectionView = ({
	caption,
	items,
	sectionId,
	spacingSource,
	title,
	typeHandle
}: ListSectionViewProps) => (
	<section
		data-section-id={sectionId ?? undefined}
		data-section-type={typeHandle ?? undefined}
		style={getSectionSpacingStyle(spacingSource)}
		className={$.section}>
		<Wrapper>
			<div className={$.head}>
				{caption ? <Anim.p className='text-caption'>{caption}</Anim.p> : null}
				{title ? <Anim.h2>{title}</Anim.h2> : null}
			</div>
			{items.length ? (
				<div className={$.list}>
					{items.map((item, index) => (
						<article className={$.item} key={item.id ?? `${item.title}-${index}`}>
							{item.title ? <h3>{item.title}</h3> : null}
							{item.description ? <p>{item.description}</p> : null}
						</article>
					))}
				</div>
			) : null}
		</Wrapper>
	</section>
)

export const SectionList = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionList_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const items = (data.sectionListItems ?? []).flatMap((item) =>
		isListItem(item)
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
