import { Anim, ImageCraft, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import { getSectionSpacingStyle } from '../utils/section-spacing'
import $ from './style.module.scss'

export const SectionValues = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionValues_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const items = (data.sectionValuesItems ?? []).filter(
		(item): item is NonNullable<(typeof data.sectionValuesItems)[number]> =>
			item?.__typename === 'valueItem_Entry'
	)

	return (
		<section
			className={$.section}
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			style={getSectionSpacingStyle(spacingSource)}>
			<Wrapper>
				<div className={$.head}>
					{data.caption ? (
						<Anim.div
							className='text-caption'
							dangerouslySetInnerHTML={{ __html: data.caption }}
						/>
					) : null}
					{data.title ? <Anim.h2>{data.title}</Anim.h2> : null}
				</div>
				{items.length ? (
					<div className={$.grid}>
						{items.map((item, index) => (
							<Anim.article
								className={$.item}
								key={item.id ?? `${item.title}-${index}`}
								type='fade-up'>
								{item.image?.[0] ? (
									<div className={$.image_wrapper}>
										<ImageCraft
											className={$.image}
											image={item.image[0]}
											sizes='(max-width: 768px) 100vw, 33vw'
										/>
									</div>
								) : null}
								<div className={$.content}>
									{item.title ? <h3 className='title-h4'>{item.title}</h3> : null}
									{item.richText?.html ? (
										<div
											className={clsx('rich-text', $.text)}
											dangerouslySetInnerHTML={{ __html: item.richText.html }}
										/>
									) : null}
								</div>
							</Anim.article>
						))}
					</div>
				) : null}
			</Wrapper>
		</section>
	)
}
