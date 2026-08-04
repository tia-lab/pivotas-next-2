import { Anim, Button, Wrapper } from '@/Components'
import clsx from 'clsx'
import type { ComponentProps, ReactElement } from 'react'
import { NewsSlider } from '../SectionNews/NewsSlider.client'
import $ from '../SectionNews/style.module.scss'
import {
	getSectionSpacingStyle,
	type SectionSpacingSource
} from './section-spacing'

export type SectionEntryListLink = NonNullable<
	ComponentProps<typeof Button>['link']
>

export type EntryOrder = 'newest' | 'oldest'

export const normalizeEntryLimit = (value: unknown) => {
	const parsed = Number(value)

	return Number.isFinite(parsed) && parsed > 0 ? parsed : 12
}

export const normalizeEntryOrder = (value: unknown): EntryOrder => {
	return value === 'oldest' ? 'oldest' : 'newest'
}

type SectionEntryListProps<T> = {
	caption?: string | null
	items: T[]
	links?: ReadonlyArray<SectionEntryListLink | null> | null
	renderItem: (item: T) => ReactElement
	sectionId?: string | null
	spacingSource: SectionSpacingSource
	title?: string | null
	typeHandle?: string | null
	variant?: string | null
}

export const SectionEntryList = <T,>({
	caption,
	items,
	links,
	renderItem,
	sectionId,
	spacingSource,
	title,
	typeHandle,
	variant
}: SectionEntryListProps<T>) => {
	const sectionLinks = links?.filter((link): link is SectionEntryListLink =>
		Boolean(link)
	)
	const content = items.map(renderItem)

	return (
		<section
			data-section-id={sectionId ?? undefined}
			data-section-type={typeHandle ?? undefined}
			data-news-variant={variant ?? undefined}
			style={getSectionSpacingStyle(spacingSource)}
			className={$.section}>
			<Wrapper>
				<div className={clsx($.head, variant === 'slider' && $.is_slider)}>
					{caption ? <Anim.p className='text-caption'>{caption}</Anim.p> : null}
					{title ? <Anim.h2>{title}</Anim.h2> : null}
				</div>
				{variant === 'slider' ? (
					<NewsSlider>{content}</NewsSlider>
				) : (
					<div className={$.grid}>{content}</div>
				)}
				{sectionLinks?.length ? (
					<div className={clsx($.links, variant === 'slider' && $.is_slider)}>
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
