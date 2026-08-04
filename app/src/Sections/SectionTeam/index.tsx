import { Anim, Button, CardTeamMember, Wrapper } from '@/Components'
import { getTeam, type TeamOrder } from '@/lib/craft/queries'
import { RenderableSectionFragment, TeamIndexQuery } from '@/queries'
import type { FragmentOf, ResultOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import type { ComponentProps, ReactNode } from 'react'
import type { SectionComponentProps } from '../SectionRouter'
import { normalizeEntryLimit } from '../utils/section-entry-list'
import {
	getSectionSpacingStyle,
	type SectionSpacingSource
} from '../utils/section-spacing'
import $ from './style.module.scss'
import { TeamSlider } from './TeamSlider.client'

type SectionTeamEntry = Extract<
	FragmentOf<typeof RenderableSectionFragment>,
	{ __typename?: 'sectionTeam_Entry' }
>
type SelectedTeamItem = NonNullable<
	NonNullable<SectionTeamEntry['selectedTeamMembers']>[number]
>
type FallbackTeamItem = NonNullable<
	NonNullable<ResultOf<typeof TeamIndexQuery>['entries']>[number]
>
type TeamItemSource = SelectedTeamItem | FallbackTeamItem
type TeamItem = Extract<TeamItemSource, { __typename: 'teamMember_Entry' }>
type TeamSectionLink = NonNullable<ComponentProps<typeof Button>['link']>

type SectionTeamLayoutProps = {
	caption?: string | null
	children: ReactNode
	links?: ReadonlyArray<TeamSectionLink | null> | null
	sectionId?: string | null
	spacingSource: SectionSpacingSource
	title?: string | null
	typeHandle?: string | null
	variant?: string | null
}

const normalizeTeamOrder = (value: unknown): TeamOrder => {
	if (
		value === 'firstNameDesc' ||
		value === 'lastNameAsc' ||
		value === 'lastNameDesc'
	) {
		return value
	}

	return 'firstNameAsc'
}

const isTeamItem = (item: unknown): item is TeamItem => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item as { __typename?: string }).__typename === 'teamMember_Entry'
	)
}

const TeamList = ({
	items,
	variant
}: {
	items: TeamItem[]
	variant?: string | null
}) => {
	const cards = items.map((item) => (
		<CardTeamMember key={item.id ?? item.uri} item={item} />
	))

	if (variant === 'slider') {
		return <TeamSlider>{cards}</TeamSlider>
	}

	return <div className={$.grid}>{cards}</div>
}

const SectionTeamLayout = ({
	caption,
	children,
	links,
	sectionId,
	spacingSource,
	title,
	typeHandle,
	variant
}: SectionTeamLayoutProps) => {
	const sectionLinks = links?.filter((link): link is TeamSectionLink =>
		Boolean(link)
	)

	return (
		<section
			data-section-id={sectionId ?? undefined}
			data-section-type={typeHandle ?? undefined}
			data-news-variant={variant ?? undefined}
			style={getSectionSpacingStyle(spacingSource)}
			className={$.section}>
			<Wrapper container={true}>
				<div className={`${$.head} ${variant === 'slider' ? $.is_slider : ''}`}>
					{caption ? <Anim.p className='text-caption'>{caption}</Anim.p> : null}
					{title ? <Anim.h2>{title}</Anim.h2> : null}
				</div>
				{children}
				{sectionLinks?.length ? (
					<div className={`${$.links} ${variant === 'slider' ? $.is_slider : ''}`}>
						{sectionLinks.map((link, index) => (
							<Button
								key={index}
								link={link}
								arrow={true}
								variant='outline'
								transition='fade'
							/>
						))}
					</div>
				) : null}
			</Wrapper>
		</section>
	)
}

const SectionTeamFallback = async ({
	limit,
	order,
	variant
}: {
	limit: number
	order: TeamOrder
	variant?: string | null
}) => {
	const data = await getTeam(limit, order)
	const items = (data.entries?.filter(isTeamItem) ?? []) as TeamItem[]

	return <TeamList items={items} variant={variant} />
}

export const SectionTeam = ({
	section,
	spacingOverride
}: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionTeam_Entry') {
		return null
	}

	const spacingSource = spacingOverride?.customSpacing ? spacingOverride : data
	const selectedTeamMembers = (data.selectedTeamMembers?.filter(isTeamItem) ??
		[]) as TeamItem[]

	return (
		<SectionTeamLayout
			caption={data.caption}
			links={data.links}
			sectionId={data.id}
			spacingSource={spacingSource}
			title={data.title}
			typeHandle={data.typeHandle}
			variant={data.newsVariant}>
			{selectedTeamMembers.length ? (
				<TeamList items={selectedTeamMembers} variant={data.newsVariant} />
			) : (
				<SectionTeamFallback
					limit={normalizeEntryLimit(data.itemsLimit)}
					order={normalizeTeamOrder(data.teamOrderBy)}
					variant={data.newsVariant}
				/>
			)}
		</SectionTeamLayout>
	)
}
