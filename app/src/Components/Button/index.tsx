'use client'

import { type PageTransitionName } from '@/animations/transitions'
import { useCursorInteraction, usePageTransition } from '@/hooks'
import { LinkFragment } from '@/queries'
import { ModalStore, useModalStore } from '@/store/modal'
import { SidebarStore, useSidebarStore } from '@/store/sidebar'
import clsx from 'clsx'
import type { FragmentOf } from 'gql.tada'
import { readFragment } from 'gql.tada'
import $ from './style.module.scss'

type LinkEntry = FragmentOf<typeof LinkFragment>

export interface ButtonProps extends Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	| 'onClick'
	| 'onPointerEnter'
	| 'onPointerLeave'
	| 'onPointerDown'
	| 'onPointerUp'
> {
	onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
	onPointerEnter?: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	>
	onPointerLeave?: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	>
	onPointerDown?: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	>
	onPointerUp?: React.PointerEventHandler<HTMLButtonElement | HTMLAnchorElement>
	nextJs?: boolean
	href?: string
	link?: LinkEntry | null
	target?: '_blank' | '_self' | '_parent' | '_top'
	transition?: PageTransitionName
	size?: 'small' | 'medium' | 'large'
	modal?: ModalStore['type']
	sidebar?: SidebarStore['type']
	download?: boolean | string
	variant?: 'default' | 'outline' | 'white-outline'
	children?: React.ReactNode
	arrow?: boolean
}

export const Button = ({
	nextJs = true,
	target,
	onClick,
	size = 'medium',
	href,
	link,
	transition,
	type = 'button',
	modal,
	sidebar,
	download,
	variant = 'default',
	className: externalClassName,
	onPointerEnter,
	onPointerLeave,
	onPointerDown,
	onPointerUp,
	arrow,
	children,
	'aria-label': ariaLabel,
	...props
}: ButtonProps) => {
	const linkData = link ? readFragment(LinkFragment, link) : null
	const pageUri = linkData?.pageLink[0]?.uri
	const linkHref =
		linkData?.externalUrl ||
		(pageUri ? `/${pageUri === '__home__' ? '' : pageUri}` : undefined)
	const resolvedHref = href ?? linkHref
	const resolvedTarget =
		target ??
		(linkData?.isExternal || linkData?.linkTarget === '_blank'
			? '_blank'
			: '_self')
	const resolvedNextJs = nextJs && resolvedTarget !== '_blank'
	const resolvedChildren = children ?? linkData?.title

	const setModalType = useModalStore((state) => state.setType)
	const setModalOpen = useModalStore((state) => state.updateOpen)
	const setSidebarType = useSidebarStore((state) => state.setType)
	const setSidebarOpen = useSidebarStore((state) => state.updateOpen)
	const { navigate } = usePageTransition()
	const cursorHandlers = useCursorInteraction<
		HTMLButtonElement | HTMLAnchorElement
	>({
		variant: 'hover'
	})

	const className = clsx(
		$.button,
		$.button_primary,
		{
			[$.small]: size === 'small',
			[$.medium]: size === 'medium',
			[$.large]: size === 'large',
			[$.outline]: variant === 'outline',
			[$.white_outline]: variant === 'white-outline',
			[$.is_arrow]: arrow
		},
		externalClassName
	)

	const handlePointerEnter: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	> = (event) => {
		onPointerEnter?.(event)
		cursorHandlers.onPointerEnter?.(event)
	}

	const handlePointerLeave: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	> = (event) => {
		onPointerLeave?.(event)
		cursorHandlers.onPointerLeave?.(event)
	}

	const handlePointerDown: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	> = (event) => {
		onPointerDown?.(event)
		cursorHandlers.onPointerDown?.(event)
	}

	const handlePointerUp: React.PointerEventHandler<
		HTMLButtonElement | HTMLAnchorElement
	> = (event) => {
		onPointerUp?.(event)
		cursorHandlers.onPointerUp?.(event)
	}

	if (resolvedHref && !modal) {
		if (resolvedNextJs) {
			return (
				<a
					href={resolvedHref}
					className={className}
					aria-label={ariaLabel ?? 'button link'}
					onPointerEnter={handlePointerEnter}
					onPointerLeave={handlePointerLeave}
					onPointerDown={handlePointerDown}
					onPointerUp={handlePointerUp}
					onClick={(event) => {
						if (onClick) {
							onClick(event)
						}

						if (
							event.defaultPrevented ||
							event.metaKey ||
							event.ctrlKey ||
							event.shiftKey ||
							event.altKey
						) {
							return
						}

						event.preventDefault()
						navigate(resolvedHref, { transition })
					}}>
					{resolvedChildren}
					{arrow ? <Arrow /> : null}
				</a>
			)
		}

		return (
			<a
				href={resolvedHref}
				target={resolvedTarget}
				rel={resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined}
				className={className}
				download={download}
				aria-label={ariaLabel ?? 'button link'}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onClick={(event: any) => {
					if (onClick) {
						onClick(event)
					}
				}}>
				{resolvedChildren}
				{arrow ? <Arrow /> : null}
			</a>
		)
	}

	return (
		<button
			type={type}
			onClick={(event: any) => {
				if (modal) {
					setModalType(modal)
					setModalOpen(true)
				} else if (sidebar) {
					setSidebarType(sidebar)
					setSidebarOpen(true)
				}
				if (onClick) {
					onClick(event)
				}
			}}
			className={className}
			aria-label={ariaLabel ?? 'type button'}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			{...props}>
			{resolvedChildren}
			{arrow ? <Arrow /> : null}
		</button>
	)
}

const Arrow = () => (
	<div className={$.arrow}>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='100%'
			height='100%'
			viewBox='0 0 17 17'
			fill='none'>
			<path
				d='M16.961 8.30863C16.939 8.26015 16.9093 8.21557 16.873 8.17663C16.865 8.16763 16.862 8.15563 16.854 8.14663L8.854 0.146631C8.76011 0.0527448 8.63278 0 8.5 0C8.36722 0 8.23989 0.0527448 8.146 0.146631C8.05211 0.240518 7.99937 0.367856 7.99937 0.500632C7.99937 0.633407 8.05211 0.760745 8.146 0.854632L15.293 8.00063H0.5C0.367392 8.00063 0.240215 8.05331 0.146447 8.14708C0.0526785 8.24085 0 8.36802 0 8.50063C0 8.63324 0.0526785 8.76042 0.146447 8.85419C0.240215 8.94795 0.367392 9.00063 0.5 9.00063H15.293L8.146 16.1466C8.05211 16.2405 7.99937 16.3679 7.99937 16.5006C7.99937 16.6334 8.05211 16.7607 8.146 16.8546C8.23989 16.9485 8.36722 17.0013 8.5 17.0013C8.63278 17.0013 8.76011 16.9485 8.854 16.8546L16.854 8.85463C16.862 8.84563 16.865 8.83363 16.873 8.82463C16.9093 8.78569 16.939 8.74111 16.961 8.69263C16.9863 8.63178 16.9993 8.56653 16.9993 8.50063C16.9993 8.43473 16.9863 8.36948 16.961 8.30863Z'
				fill='currentColor'
			/>
		</svg>
	</div>
)
