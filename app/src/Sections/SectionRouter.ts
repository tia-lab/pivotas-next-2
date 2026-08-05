import { RenderableSectionFragment, SectionFragment } from '@/queries'
import type { FragmentOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import {
	createElement,
	Fragment,
	type ComponentType,
	type ReactElement
} from 'react'
import { SectionAbout } from './SectionAbout'
import { SectionCtaSlider } from './SectionCtaSlider'
import { SectionCtaText } from './SectionCtaText'
import { SectionEvents } from './SectionEvents'
import { SectionExpertise } from './SectionExpertise'
import { SectionHero } from './SectionHero'
import { SectionNews } from './SectionNews'
import { SectionNewsEvents } from './SectionNewsEvents'
import { SectionServices } from './SectionServices'
import { SectionTeam } from './SectionTeam'

type Section = FragmentOf<typeof SectionFragment>
export type RenderableSection = FragmentOf<typeof RenderableSectionFragment>

type Props = {
	sections?: ReadonlyArray<Section | null> | null
}

export type SectionComponentProps = {
	section: RenderableSection
}

type SectionComponent = ComponentType<SectionComponentProps>

const sectionComponents: Record<string, SectionComponent> = {
	sectionAbout_Entry: SectionAbout,
	sectionCta_Entry: SectionCtaSlider,
	sectionHero_Entry: SectionHero,
	sectionNews_Entry: SectionNews,
	sectionEvents_Entry: SectionEvents,
	sectionNewsEvents_Entry: SectionNewsEvents,
	sectionExpertise_Entry: SectionExpertise,
	sectionServices_Entry: SectionServices,
	sectionTeam_Entry: SectionTeam,
	sectionTextCta_Entry: SectionCtaText
}

const renderRenderableSection = (
	section: RenderableSection,
	index: number,
	keyOverride?: string
): ReactElement | null => {
	const data = readFragment(RenderableSectionFragment, section)
	const Component = sectionComponents[data.__typename]

	if (!Component) {
		return null
	}

	const key =
		keyOverride ?? ('id' in data && data.id ? data.id : `section-${index}`)

	return createElement(Component, {
		key,
		section
	})
}

const renderSection = (
	section: Section,
	index: number
): ReactElement | null => {
	const data = readFragment(SectionFragment, section)

	if (data.__typename === 'sectionReference_Entry') {
		const referencedSection = data.referencedSection[0] ?? null

		if (!referencedSection) {
			return null
		}

		const referencedData = readFragment(
			RenderableSectionFragment,
			referencedSection
		)
		const referenceId = data.id ?? `section-reference-${index}`
		const referencedId =
			'id' in referencedData && referencedData.id
				? referencedData.id
				: `referenced-section-${index}`

		return renderRenderableSection(
			referencedSection,
			index,
			`${referenceId}:${referencedId}`
		)
	}

	return renderRenderableSection(data, index)
}

export const SectionRouter = ({ sections }: Props) => {
	const children = sections
		?.filter((section): section is Section => Boolean(section))
		.map(renderSection)
		.filter((section): section is ReactElement => Boolean(section))

	return createElement(Fragment, null, children)
}
