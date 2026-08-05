import { Anim, Svgs, Wrapper } from '@/Components'
import { Form } from '@/Components/Form'
import { Footer } from '@/Sections/Footer'
import { EntryByUriQuery } from '@/queries'
import clsx from 'clsx'
import type { ResultOf } from 'gql.tada'
import { FormTabs } from './FormTabs.client'
import $ from './style.module.scss'

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>['entry']>
type FormEntry = Extract<Entry, { __typename: 'formPage_Entry' }>

type Props = {
	entry: FormEntry
}

export const FormTemplate = ({ entry }: Props) => {
	const title = entry.richText?.html ?? entry.title ?? null
	const forms = entry.forms.flatMap((item, index) => {
		if (!item || item.__typename !== 'formItem_Entry') {
			return []
		}

		return [
			{
				...item,
				tabId: item.id ?? `form-${index}`,
				tabLabel: item.tabLabel || `Form ${index + 1}`
			}
		]
	})

	return (
		<>
			<section className={$.section}>
				<Wrapper container>
					<div className={clsx($.head)}>
						<Anim.div className={$.logo} type='fade-up-rotate'>
							<Svgs type='logoRound' />
						</Anim.div>
						{title ? (
							<Anim.div
								className={clsx('title-h1', $.title)}
								type='fade-up'
								dangerouslySetInnerHTML={{ __html: title }}
							/>
						) : null}
					</div>
					<Anim.div className={$.form} type='fade-up'>
						<FormTabs
							tabs={forms.map((item) => ({
								id: item.tabId,
								label: item.tabLabel
							}))}>
							{forms.map((item) => (
								<div key={item.tabId}>
									<Form data={item.form ?? null} />
								</div>
							))}
						</FormTabs>
						{forms.length ? (
							<div className={$.form_overlay} aria-hidden='true' />
						) : null}
					</Anim.div>
				</Wrapper>
			</section>
			<Footer />
		</>
	)
}
