import { graphql } from '@/lib/craft/graphql'

export const ServiceFragment = graphql(`
	fragment ServiceFragment on service_Entry {
		id
		title
		description
	}
`)
