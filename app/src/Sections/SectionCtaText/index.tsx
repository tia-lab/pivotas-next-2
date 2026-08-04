import { Anim, Button, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import { getSectionSpacingStyle } from '../utils/section-spacing'
import $ from './style.module.scss'

export const SectionCtaText = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionTextCta_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const links = data.links?.filter((link): link is NonNullable<typeof link> =>
		Boolean(link)
	)

	return (
		<section
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			style={getSectionSpacingStyle(spacingSource)}
			className={clsx('section', $.section)}>
			<Wrapper container>
				<div className={$.content}>
					{data.title ? <Anim.h2 type='fade-up'>{data.title}</Anim.h2> : null}
					{data.text ? <Anim.p type='fade-up'>{data.text}</Anim.p> : null}
					{links?.length ? (
						<Anim.div type='fade-up' className={$.links}>
							{links.map((link, index) => (
								<Button
									key={index}
									link={link}
									arrow={true}
									transition='fade'
									variant='outline'
								/>
							))}
						</Anim.div>
					) : null}
				</div>
			</Wrapper>
		</section>
	)
}
