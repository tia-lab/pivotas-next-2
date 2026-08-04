import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'
import { SectionFragment } from './fragments/section'
import { SeoFragment } from './fragments/seo'

export const EntryByUriQuery = graphql(
	`
		query EntryByUri($uri: [String]) {
			entry(uri: $uri) {
				__typename
				id
				title
				uri
				sectionHandle
				typeHandle
				... on page_Entry {
					...SeoFragment
					image {
						...AssetImageFragment
					}
					sections {
						...SectionFragment
					}
				}
				... on legalPage_Entry {
					...LegalSeoFragment
					image {
						...AssetImageFragment
					}
					richText {
						html
					}
				}
				... on news_Entry {
					...NewsSeoFragment
					postDate
					image {
						...AssetImageFragment
					}
					excerpt
					richText {
						html
					}
				}
			}
		}
	`,
	[AssetImageFragment, SectionFragment, SeoFragment]
)
