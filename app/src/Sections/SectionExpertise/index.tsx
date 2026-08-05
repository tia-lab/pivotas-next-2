import { Anim, Button, CardExpertise, Wrapper } from '@/Components'
import { getExpertise, type ExpertiseOrder } from '@/lib/craft/queries'
import { ExpertiseIndexQuery, RenderableSectionFragment } from '@/queries'
import clsx from 'clsx'
import type { FragmentOf, ResultOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import type { SectionComponentProps } from '../SectionRouter'
import { ExpertiseSlider } from './ExpertiseSlider.client'
import $ from './style.module.scss'

type SectionExpertiseEntry = Extract<
	FragmentOf<typeof RenderableSectionFragment>,
	{ __typename?: 'sectionExpertise_Entry' }
>
type SelectedExpertiseItem = NonNullable<
	NonNullable<SectionExpertiseEntry['selectedExpertise']>[number]
>
type FallbackExpertiseItem = NonNullable<
	NonNullable<ResultOf<typeof ExpertiseIndexQuery>['entries']>[number]
>
type ExpertiseItemSource = SelectedExpertiseItem | FallbackExpertiseItem
type ExpertiseItem = Extract<
	ExpertiseItemSource,
	{ __typename: 'expertise_Entry' }
>

const normalizeLimit = (value: unknown) => {
	const parsed = Number(value)

	return Number.isFinite(parsed) && parsed > 0 ? parsed : 12
}

const normalizeOrder = (value: unknown): ExpertiseOrder => {
	return value === 'oldest' ? 'oldest' : 'newest'
}

const isExpertiseItem = (item: unknown): item is ExpertiseItem => {
	return (
		typeof item === 'object' &&
		item !== null &&
		(item as { __typename?: string }).__typename === 'expertise_Entry'
	)
}

const ExpertiseList = ({
	items,
	variant
}: {
	items: ExpertiseItem[]
	variant?: string | null
}) => {
	const articles = items.map((item) => (
		<CardExpertise key={item.id ?? item.uri} item={item} variant={variant} />
	))

	if (variant === 'slider') {
		return <ExpertiseSlider>{articles}</ExpertiseSlider>
	}

	return <div className={$.grid}>{articles}</div>
}

const SectionExpertiseFallback = async ({
	limit,
	order,
	variant
}: {
	limit: number
	order: ExpertiseOrder
	variant?: string | null
}) => {
	const data = await getExpertise(limit, order)
	const items = (data.entries?.filter(isExpertiseItem) ?? []) as ExpertiseItem[]

	return <ExpertiseList items={items} variant={variant} />
}

export const SectionExpertise = ({ section }: SectionComponentProps) => {
	const data = readFragment(RenderableSectionFragment, section)

	if (data.__typename !== 'sectionExpertise_Entry') {
		return null
	}

	const selectedExpertise = (data.selectedExpertise?.filter(isExpertiseItem) ??
		[]) as ExpertiseItem[]

	return (
		<section
			data-section-id={data.id ?? undefined}
			data-section-type={data.typeHandle ?? undefined}
			data-news-variant={data.newsVariant ?? undefined}
			className={$.section}>
			<Wrapper>
				<div className={clsx($.head, data.newsVariant === 'slider' && $.is_slider)}>
					<Anim.p className='text-caption'>{data.caption}</Anim.p>
					<Anim.h2 className='title-h4'>{data.title}</Anim.h2>
				</div>
				{selectedExpertise.length ? (
					<ExpertiseList items={selectedExpertise} variant={data.newsVariant} />
				) : (
					<SectionExpertiseFallback
						limit={normalizeLimit(data.itemsLimit)}
						order={normalizeOrder(data.orderBy)}
						variant={data.newsVariant}
					/>
				)}
				{data.links?.length ? (
					<div
						className={clsx($.links, data.newsVariant === 'slider' && $.is_slider)}>
						{data.links.map((link, i) => (
							<Button
								key={i}
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
