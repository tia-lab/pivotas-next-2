import { Anim, Container, ImageCraft, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import type { FragmentOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import $ from './style.module.scss'

interface SectionAboutProps extends React.HTMLAttributes<HTMLElement> {
	section?: FragmentOf<typeof RenderableSectionFragment> | null
}

export const SectionAbout = ({
	section,
	className,
	...props
}: SectionAboutProps) => {
	const data = section ? readFragment(RenderableSectionFragment, section) : null

	if (data?.__typename !== 'sectionAbout_Entry') {
		return null
	}

	const images = data.images.filter(Boolean).slice(0, 2)
	const primaryImage = images[0] ?? null
	const secondaryImage = images[1] ?? null

	const variant = data.aboutVariant || 'singleImageSmall'

	const sectionClass = clsx('section', $.section, $[variant], className)

	return (
		<section
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			className={sectionClass}
			{...props}>
			<Wrapper>
				<Container>
					<div className={$.content}>
						{data.caption ? (
							<Anim.p type='fade-up' className='text-caption'>
								{data.caption}
							</Anim.p>
						) : null}
						<Anim.h2 type='fade-up' className={$.title}>
							{data.title}
						</Anim.h2>
						{data.richText?.html && variant !== 'singleImageLarge' ? (
							<Anim.div
								type='fade-up'
								className='rich-text'
								dangerouslySetInnerHTML={{ __html: data.richText.html }}
							/>
						) : null}
					</div>
					<Anim.div type='fade' className={clsx($.image_wrapper, $.is_primary)}>
						<ImageCraft image={primaryImage} className={$.image} sizes='50vw' />
					</Anim.div>
					{variant === 'doubleImage' && secondaryImage ? (
						<Anim.div type='fade' className={clsx($.image_wrapper, $.is_secondary)}>
							<ImageCraft image={secondaryImage} className={$.image} sizes='50vw' />
						</Anim.div>
					) : null}
					{variant === 'singleImageLarge' && data.richText?.html ? (
						<Anim.div
							type='fade-up'
							className={clsx('rich-text', $.rich_text)}
							dangerouslySetInnerHTML={{ __html: data.richText.html }}
						/>
					) : null}
				</Container>
			</Wrapper>
		</section>
	)
}
