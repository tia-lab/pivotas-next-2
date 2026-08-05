import { Anim, Button, Container, ImageCraft, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import { CtaSlider } from './CtaSlider.client'
import $ from './style.module.scss'

export const SectionCtaSlider = ({ section }: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionCta_Entry') {
		return null
	}

	const slides = (data.ctaSlides ?? []).filter(
		(slide): slide is NonNullable<(typeof data.ctaSlides)[number]> =>
			slide?.__typename === 'ctaSlide_Entry'
	)

	return (
		<section
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			className={clsx('section', $.section)}>
			<Wrapper container>
				<div className={$.content}>
					{slides.length ? (
						<CtaSlider>
							{slides.map((slide) => (
								<article className={$.item} key={slide.id ?? slide.title}>
									{slide.image?.[0] ? (
										<Anim.div type='fade' className={$.image_wrapper}>
											<ImageCraft image={slide.image[0]} className={$.image} />
										</Anim.div>
									) : null}
									<Container className={$.item_container}>
										<div className={$.item_content}>
											{slide.title ? <h3 className='title-h1'>{slide.title}</h3> : null}
											{slide.text ? <p>{slide.text}</p> : null}
											{slide.links?.length ? (
												<div className={$.links}>
													{slide.links.map((link, index) => {
														if (!link) {
															return null
														}

														return (
															<Button transition='fade' key={index} link={link} arrow={true} />
														)
													})}
												</div>
											) : null}
										</div>
									</Container>
								</article>
							))}
						</CtaSlider>
					) : null}
				</div>
			</Wrapper>
		</section>
	)
}
