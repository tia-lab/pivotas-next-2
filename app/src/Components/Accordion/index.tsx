'use client'

import { config } from '$/config'
import { gsap } from '@/gsap'
import { useCursorInteraction, useGSAP } from '@/hooks'
import { useEffect, useRef, useState } from 'react'
import $ from './style.module.scss'

export interface AccordionProps {
	title: string | null
	content: string
	open?: boolean
}

export const Accordion = ({ title, content, open = false }: AccordionProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState(open)
	const tl = useRef<gsap.core.Timeline | null>(null)

	const cursorHandlers = useCursorInteraction<
		HTMLButtonElement | HTMLAnchorElement
	>({
		variant: 'hover'
	})

	const toggleAccordion = () => {
		setIsOpen(!isOpen)
	}

	useGSAP(
		() => {
			const content = '[data-content]'

			gsap.set(content, {
				autoAlpha: 0,
				height: 0,
				overflow: 'hidden'
			})

			tl.current = gsap.timeline({
				paused: true,
				defaults: {
					duration: config.animation.default,
					ease: config.animation.ease.out
				}
			})

			tl.current.to(content, {
				autoAlpha: 1,
				height: 'auto'
			})
		},
		{ scope: ref }
	)

	useEffect(() => {
		if (tl.current) {
			isOpen ? tl.current.play() : tl.current.reverse()
		}
	}, [isOpen])

	return (
		<div className={$.accordion} ref={ref} data-open={isOpen}>
			<div className={$.head} onClick={toggleAccordion}>
				<div>{title ? <p className='title-h3'>{title}</p> : null}</div>
				<button
					onPointerEnter={(event) => cursorHandlers.onPointerEnter?.(event)}
					onPointerLeave={(event) => cursorHandlers.onPointerLeave?.(event)}
					className={$.button}
					aria-label='Toggle Accordion'
					data-active={isOpen}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='100%'
						viewBox='0 0 17 17'
						fill='none'>
						<path
							d='M16.1466 8.146L9.00063 15.293V0.5C9.00063 0.367392 8.94795 0.240215 8.85419 0.146447C8.76042 0.0526785 8.63324 0 8.50063 0C8.36802 0 8.24085 0.0526785 8.14708 0.146447C8.05331 0.240215 8.00063 0.367392 8.00063 0.5V15.293L0.854632 8.146C0.808144 8.09951 0.752955 8.06264 0.692215 8.03748C0.631476 8.01232 0.566375 7.99937 0.500632 7.99937C0.434888 7.99937 0.369788 8.01232 0.309048 8.03748C0.248309 8.06264 0.193119 8.09951 0.146631 8.146C0.100144 8.19249 0.0632674 8.24768 0.0381083 8.30842C0.0129493 8.36916 0 8.43426 0 8.5C0 8.56574 0.0129493 8.63084 0.0381083 8.69158C0.0632674 8.75232 0.100144 8.80751 0.146631 8.854L8.14663 16.854C8.19353 16.9004 8.24885 16.9374 8.30963 16.963C8.43195 17.0136 8.56932 17.0136 8.69163 16.963C8.75241 16.9374 8.80773 16.9004 8.85463 16.854L16.8546 8.854C16.9485 8.76011 17.0013 8.63278 17.0013 8.5C17.0013 8.36722 16.9485 8.23989 16.8546 8.146C16.7607 8.05211 16.6334 7.99937 16.5006 7.99937C16.3679 7.99937 16.2405 8.05211 16.1466 8.146Z'
							fill='currentColor'
						/>
					</svg>
				</button>
			</div>
			<div data-content className={$.content}>
				<div className={$.spacer} />
				<div className='rich-text' dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	)
}
