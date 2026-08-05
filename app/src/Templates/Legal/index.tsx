import { Wrapper } from '@/Components'
import { Footer } from '@/Sections/Footer'
import { EntryByUriQuery } from '@/queries'
import type { ResultOf } from 'gql.tada'
import $ from './style.module.scss'

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>['entry']>
type LegalEntry = Extract<Entry, { __typename: 'legalPage_Entry' }>

type Props = {
	entry: LegalEntry
}

export const LegalTemplate = ({ entry }: Props) => {
	return (
		<>
			<main>
				<article className={$.article}>
					<Wrapper>
						<h1 className={$.title}>{entry.title}</h1>
						<div className={$.items}>
							{entry.legalItems?.map((item) => {
								if (!item || item.__typename !== 'legalItem_Entry') {
									return null
								}

								return (
									<section className={$.item} key={item.id}>
										<h2>{item.title}</h2>
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
														<details className={$.accordion} key={accordion.id}>
															<summary>{accordion.title}</summary>
															{accordion.richText?.html ? (
																<div
																	className={$.accordion_content}
																	dangerouslySetInnerHTML={{
																		__html: accordion.richText.html
																	}}
																/>
															) : null}
														</details>
													)
												})}
											</div>
										) : null}
									</section>
								)
							})}
						</div>
					</Wrapper>
				</article>
			</main>
			<Footer />
		</>
	)
}
