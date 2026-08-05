import { Anim, Wrapper } from '@/Components'
import { Form } from '@/Components/Form'
import { Footer } from '@/Sections/Footer'
import { EntryByUriQuery } from '@/queries'
import type { ResultOf } from 'gql.tada'
import $ from './style.module.scss'

type Entry = NonNullable<ResultOf<typeof EntryByUriQuery>['entry']>
type FormEntry = Extract<Entry, { __typename: 'formPage_Entry' }>

type Props = {
	entry: FormEntry
}

export const FormTemplate = ({ entry }: Props) => {
	return (
		<>
			<main>
				<section className={$.section}>
					<Wrapper container>
						<Anim.h1 className={$.title} type='fade-up'>
							{entry.title}
						</Anim.h1>
						<Anim.div className={$.form} type='fade-up'>
							<Form data={entry.form ?? null} />
						</Anim.div>
					</Wrapper>
				</section>
			</main>
			<Footer />
		</>
	)
}
