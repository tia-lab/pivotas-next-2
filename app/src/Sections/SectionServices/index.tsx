import { CardService, Container, Wrapper } from '@/Components'
import { RenderableSectionFragment } from '@/queries'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import $ from './style.module.scss'

export const SectionServices = ({ section }: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionServices_Entry') {
		return null
	}

	const items = data.selectedServices ?? []

	return (
		<section
			className={$.section}
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}>
			<Wrapper>
				<Container>
					<div className={$.head}>
						{data.caption ? <p className='text-caption'>{data.caption}</p> : null}
						{data.title ? <h2>{data.title}</h2> : null}
					</div>
					<div className={$.list}>
						{items.map((item, index) =>
							item?.__typename === 'service_Entry' ? (
								<CardService data={item} key={index} />
							) : null
						)}
					</div>
				</Container>
			</Wrapper>
		</section>
	)
}
