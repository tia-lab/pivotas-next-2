import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './fragments/asset'
import { CollectionPageConfigFragment } from './fragments/collection'
import { FreeformFormFragment } from './fragments/freeform'
import { LinkFragment } from './fragments/link'
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
				... on expertise_Entry {
					...ExpertiseSeoFragment
					image {
						...AssetImageFragment
					}
					sections {
						...SectionFragment
					}
				}
				... on legalPage_Entry {
					...LegalSeoFragment
					legalItems {
						... on legalItem_Entry {
							__typename
							id
							title
							richText {
								html
							}
							accordionItems {
								... on accordionItem_Entry {
									__typename
									id
									title
									richText {
										html
									}
								}
							}
						}
					}
				}
				... on collectionPage_Entry {
					...CollectionPageSeoFragment
					...CollectionPageConfigFragment
				}
				... on formPage_Entry {
					...FormPageSeoFragment
					form {
						...FreeformFormFragment
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
				... on event_Entry {
					...EventSeoFragment
					subtitle
					eventDate
					eventEndDate
					caption
					image {
						...AssetImageFragment
					}
					entryAuthor {
						... on teamMember_Entry {
							__typename
							id
							firstName
							lastName
							role
						}
					}
					richText {
						html
					}
					gallery {
						...AssetImageFragment
					}
					relatedLinks {
						... on relatedLink_Entry {
							id
							title
							subtitle
							links {
								...LinkFragment
							}
						}
					}
				}
			}
		}
	`,
	[
		AssetImageFragment,
		CollectionPageConfigFragment,
		FreeformFormFragment,
		LinkFragment,
		SectionFragment,
		SeoFragment
	]
)
