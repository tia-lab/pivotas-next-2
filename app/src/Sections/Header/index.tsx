import { SwitchTheme, TransitionLink, Wrapper } from '@/Components'
import { pathFromCraftUri } from '@/lib/craft/preview'
import { getNavigation } from '@/lib/craft/queries'
import { HeaderHideOnScroll } from './HeaderHideOnScroll'
import $ from './style.module.scss'

export const Header = async () => {
	const data = await getNavigation('main')
	const navigation = data.entries?.[0]
	if (navigation?.__typename !== 'navigation_Entry') {
		return null
	}

	return (
		<header className={$.header} data-header>
			<HeaderHideOnScroll />
			<Wrapper>
				<nav className={$.nav}>
					{navigation?.navigationItems?.map((item) => {
						if (!item || item.typeHandle !== 'navigationItem') {
							return null
						}

						const page = item.pageLink?.[0] ?? null
						const href =
							item.externalUrl ?? (page?.uri ? pathFromCraftUri(page.uri) : '#')
						const label = item.title || page?.title || href
						const isExternal = Boolean(item.externalUrl)

						return isExternal ? (
							<a key={item.id} href={href} target='_blank' rel='noreferrer'>
								{label}
							</a>
						) : (
							<TransitionLink key={item.id} href={href} transition='fade'>
								{label}
							</TransitionLink>
						)
					})}
					<SwitchTheme />
				</nav>
			</Wrapper>
		</header>
	)
}
