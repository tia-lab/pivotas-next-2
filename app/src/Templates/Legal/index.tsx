import { Accordion, Anim, Container, Wrapper } from '@/Components'
import { Footer } from '@/Sections/Footer'
import { EntryByUriQuery } from '@/queries'
import clsx from 'clsx'
import type { ResultOf } from 'gql.tada'
import $ from './style.module.scss'

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>['entry']>
type LegalEntry = Extract<Entry, { __typename: 'legalPage_Entry' }>

type Props = {
	entry: LegalEntry
}

export const LegalTemplate = ({ entry }: Props) => {
	const title = entry.richText?.html ?? entry.title ?? null
	const parseCounter = (n: number): string => {
		if (n < 10) {
			return `0${n}`
		} else {
			return `${n}`
		}
	}

	return (
		<>
			<section className={$.section}>
				<Wrapper>
					<div className={$.head}>
						{title ? (
							<Anim.div
								className={clsx('title-h1', $.title)}
								type='fade-up'
								dangerouslySetInnerHTML={{ __html: title }}
							/>
						) : null}
						{entry.legalItems?.length ? (
							<div className={clsx('title-h3', $.number)}>
								{parseCounter(entry.legalItems.length)}
							</div>
						) : null}
					</div>
					<div className={$.items}>
						{entry.legalItems?.map((item, i) => {
							if (!item || item.__typename !== 'legalItem_Entry') {
								return null
							}

							return (
								<div className={$.item} key={item.id}>
									<Container>
										<div className={clsx('title-h2', $.item_number)}>
											{parseCounter(i + 1)}
										</div>
										<div className={$.content}>
											{item.richText?.html ? (
												<div
													className={$.rich_text}
													dangerouslySetInnerHTML={{ __html: item.richText.html }}
												/>
											) : null}
											{item.accordionItems?.length ? (
												<div className={$.accordions}>
													{item.accordionItems.map((accordion) => {
														if (
															!accordion ||
															accordion.__typename !== 'accordionItem_Entry'
														) {
															return null
														}

														return (
															<Accordion
																title={accordion.title}
																key={accordion.id}
																content={accordion.richText?.html ?? ''}
															/>
														)
													})}
												</div>
											) : null}
										</div>
									</Container>
								</div>
							)
						})}
					</div>
				</Wrapper>
			</section>
			<Footer />
		</>
	)
}
