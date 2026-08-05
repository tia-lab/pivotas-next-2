import { graphql } from '@/lib/craft/graphql'
import { AssetImageFragment } from './asset'
import { FreeformFormFragment } from './freeform'
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

				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
			}
			... on sectionTextCta_Entry {
				id
				title
				typeHandle
				text
				links {
					...LinkFragment
				}
				customSpacing
				spaceTop
				spaceBottom
			}
			... on sectionContact_Entry {
				id
				title
				typeHandle
				text
				form {
					...FreeformFormFragment
				}
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
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
				customSpacing
				spaceTop
				spaceBottom
			}
		}
	`,
	[AssetImageFragment, FreeformFormFragment, LinkFragment, ServiceFragment]
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
				customSpacing
				spaceTop
				spaceBottom
				referencedSection {
					...RenderableSectionFragment
				}
			}
		}
	`,
	[RenderableSectionFragment]
)
