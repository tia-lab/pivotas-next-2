import { Anim, ImageCraft, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import { getSectionSpacingStyle } from '../utils/section-spacing'
import { ImageSlider } from './ImageSlider.client'
import $ from './style.module.scss'

export const SectionImageSlider = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionImageSlider_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const items = (data.sectionImageSliderItems ?? []).filter(
		(item): item is NonNullable<(typeof data.sectionImageSliderItems)[number]> =>
			item?.__typename === 'imageSlide_Entry'
	)
	const slides = items.map((item, index) => (
		<article className={$.item} key={item.id ?? `${item.title}-${index}`}>
			{item.image?.[0] ? (
				<div className={$.image_wrapper}>
					<ImageCraft
						className={$.image}
						image={item.image[0]}
						sizes='(max-width: 768px) 85vw, 46rem'
					/>
				</div>
			) : null}
			{item.title || item.subtitle ? (
				<div className={$.content}>
					{item.title ? <h3 className='title-h4'>{item.title}</h3> : null}
					{item.subtitle ? <p>{item.subtitle}</p> : null}
				</div>
			) : null}
		</article>
	))

	return (
		<section
			className={$.section}
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			data-section-variant={data.sectionVariant ?? undefined}
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
				{slides.length ? (
					<div className={clsx($.items, data.sectionVariant === 'slider' && $.is_slider)}>
						{data.sectionVariant === 'slider' ? (
							<ImageSlider>{slides}</ImageSlider>
						) : (
							slides
						)}
					</div>
				) : null}
			</Wrapper>
		</section>
	)
}
