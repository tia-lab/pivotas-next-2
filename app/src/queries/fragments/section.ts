import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './asset'
import { LinkFragment } from './link'
import { ServiceFragment } from './service'

export const RenderableSectionFragment = graphql(
	`
		fragment RenderableSectionFragment on EntryInterface {
			__typename
			... on sectionHero_Entry {
				id
				title
				typeHandle
				subtitle
				description
				image {
					...AssetImageFragment
				}
				links {
					...LinkFragment
				}

			}
			... on sectionAbout_Entry {
				id
				title
				typeHandle
				aboutVariant
				caption
				richText {
					html
				}
				images {
					...AssetImageFragment
				}
			}
			... on sectionCta_Entry {
				id
				title
				typeHandle
				ctaSlides {
					... on ctaSlide_Entry {
						__typename
						id
						title
						text
						image {
							...AssetImageFragment
						}
						links {
							...LinkFragment
						}
					}
				}
			}
			... on sectionTextCta_Entry {
				id
				title
				typeHandle
				text
				links {
					...LinkFragment
				}
			}
			... on sectionNews_Entry {
				id
				title
				typeHandle
				newsVariant
				itemsLimit
				caption
				orderBy
				selectedNews {
					... on news_Entry {
						__typename
						id
						title
						uri
						postDate
						excerpt
						image {
							...AssetImageFragment
						}
					}
				}
				links {
					...LinkFragment
				}
			}
			... on sectionEvents_Entry {
				id
				title
				typeHandle
				newsVariant: sectionVariant
				itemsLimit
				caption
				orderBy
				selectedEvents {
					... on event_Entry {
						__typename
						id
						title
						uri
						eventDate
						eventEndDate
						subtitle
						image {
							...AssetImageFragment
						}
					}
				}
				links {
					...LinkFragment
				}
			}
			... on sectionNewsEvents_Entry {
				id
				title
				typeHandle
				caption
				selectedNews {
					... on news_Entry {
						__typename
						id
						title
						uri
						postDate
						excerpt
						image {
							...AssetImageFragment
						}
					}
				}
				selectedEvents {
					... on event_Entry {
						__typename
						id
						title
						uri
						eventDate
						eventEndDate
						subtitle
						image {
							...AssetImageFragment
						}
					}
				}
				links {
					...LinkFragment
				}
			}
			... on sectionExpertise_Entry {
				id
				title
				caption
				typeHandle
				newsVariant: sectionVariant
				itemsLimit
				orderBy
				links {
					...LinkFragment
				}
				selectedExpertise {
					... on expertise_Entry {
						__typename
						id
						title
						uri
						postDate
						image {
							...AssetImageFragment
						}
					}
				}
			}
			... on sectionServices_Entry {
				id
				title
				caption
				typeHandle
				selectedServices {
					... on service_Entry {
						__typename
						...ServiceFragment
					}
				}
			}
			... on sectionTeam_Entry {
				id
				title
				caption
				typeHandle
				newsVariant: sectionVariant
				itemsLimit
				teamOrderBy
				links {
					...LinkFragment
				}
				selectedTeamMembers {
					... on teamMember_Entry {
						__typename
						id
						title
						uri
						firstName
						lastName
						role
						expertiseLabel
						image {
							...AssetImageFragment
						}
					}
				}
			}
		}
	`,
	[AssetImageFragment, LinkFragment, ServiceFragment]
)

export const SectionFragment = graphql(
	`
		fragment SectionFragment on sections_MatrixField {
			__typename
			...RenderableSectionFragment
			... on sectionReference_Entry {
				id
				title
				typeHandle
				referencedSection {
					...RenderableSectionFragment
				}
			}
		}
	`,
	[RenderableSectionFragment]
)
