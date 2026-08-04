'use client'

import { ButtonIcon } from '@/Components/ButtonIcon'
import { gsap } from '@/gsap'
import clsx from 'clsx'
import {
	Children,
	type MouseEvent,
	type MutableRefObject,
	type PointerEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import $ from './style.module.scss'

type Direction = 'next' | 'prev'

type DragState = {
	pointerId: number
	triggered: boolean
	x: number
	y: number
}

type Layout = {
	left: string
	width: string
}

const hiddenLeft: Layout = { left: '0%', width: '0%' }
const large: Layout = { left: '0%', width: '66.6667%' }
const small: Layout = { left: '66.6667%', width: '33.3333%' }
const hiddenRight: Layout = { left: '100%', width: '0%' }
const moveDuration = 0.8
const fadeDuration = 0.2
const ease = 'power2.inOut'

const resetDragClickGuard = (guard: MutableRefObject<boolean>) => {
	window.setTimeout(() => {
		guard.current = false
	}, 180)
}

const isInteractiveTarget = (target: EventTarget | null) => {
	return (
		target instanceof Element &&
		Boolean(target.closest('a, button, input, textarea, select, [role="button"]'))
	)
}

export const ExpertiseSlider = ({ children }: { children: ReactNode }) => {
	const slides = useMemo(() => Children.toArray(children), [children])
	const maxActiveIndex = Math.max(0, slides.length - 2)
	const [activeIndex, setActiveIndex] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const cardRefs = useRef<(HTMLDivElement | null)[]>([])
	const drag = useRef<DragState | null>(null)
	const didDrag = useRef(false)
	const tl = useRef<gsap.core.Timeline | null>(null)

	const canScrollPrev = activeIndex > 0 && !isAnimating
	const canScrollNext = activeIndex < maxActiveIndex && !isAnimating

	const getCard = useCallback((index: number) => cardRefs.current[index], [])

	const getContent = useCallback((index: number) => {
		return cardRefs.current[index]?.querySelector('[data-card-content]')
	}, [])

	const setCardLayout = useCallback(
		(index: number, layout: Layout) => {
			const card = getCard(index)

			if (!card) {
				return
			}

			gsap.set(card, layout)
		},
		[getCard]
	)

	const syncRestLayout = useCallback(
		(index: number) => {
			slides.forEach((_, slideIndex) => {
				if (slideIndex < index) {
					setCardLayout(slideIndex, hiddenLeft)
				} else if (slideIndex === index) {
					setCardLayout(slideIndex, large)
				} else if (slideIndex === index + 1) {
					setCardLayout(slideIndex, small)
				} else {
					setCardLayout(slideIndex, hiddenRight)
				}
			})
		},
		[setCardLayout, slides]
	)

	useEffect(() => {
		requestAnimationFrame(() => {
			syncRestLayout(activeIndex)
		})
	}, [activeIndex, syncRestLayout])

	useEffect(() => {
		const onResize = () => {
			syncRestLayout(activeIndex)
		}

		window.addEventListener('resize', onResize)

		return () => window.removeEventListener('resize', onResize)
	}, [activeIndex, syncRestLayout])

	const animate = useCallback(
		(direction: Direction) => {
			if (isAnimating || slides.length < 2) {
				return
			}

			const targetIndex = direction === 'next' ? activeIndex + 1 : activeIndex - 1

			if (targetIndex < 0 || targetIndex > maxActiveIndex) {
				return
			}

			const exitingIndex = direction === 'next' ? activeIndex : activeIndex + 1
			const growingIndex = direction === 'next' ? activeIndex + 1 : activeIndex - 1
			const enteringIndex =
				direction === 'next' ? activeIndex + 2 : activeIndex - 1
			const enteringStart = direction === 'next' ? hiddenRight : hiddenLeft
			const exitingEnd = direction === 'next' ? hiddenLeft : hiddenRight
			const enteringEnd = direction === 'next' ? small : large

			tl.current?.kill()
			setIsAnimating(true)

			requestAnimationFrame(() => {
				if (direction === 'next') {
					setCardLayout(exitingIndex, large)
					setCardLayout(growingIndex, small)
				} else {
					setCardLayout(enteringIndex, hiddenLeft)
					setCardLayout(activeIndex, large)
					setCardLayout(exitingIndex, small)
				}

				setCardLayout(enteringIndex, enteringStart)

				const exitingContent = getContent(exitingIndex)
				const enteringContent = getContent(enteringIndex)

				if (enteringContent) {
					gsap.set(enteringContent, { autoAlpha: 0 })
				}

				tl.current = gsap.timeline({
					onComplete: () => {
						setActiveIndex(targetIndex)
						setIsAnimating(false)
						requestAnimationFrame(() => {
							syncRestLayout(targetIndex)
						})
					}
				})

				if (exitingContent) {
					tl.current.to(
						exitingContent,
						{
							autoAlpha: 0,
							duration: fadeDuration,
							ease: 'power2.out'
						},
						0
					)
				}

				tl.current.add('move', '>')

				if (direction === 'next') {
					tl.current.fromTo(
						getCard(exitingIndex),
						large,
						{
							...exitingEnd,
							duration: moveDuration,
							ease
						},
						'move'
					)
					tl.current.fromTo(
						getCard(growingIndex),
						small,
						{
							...large,
							duration: moveDuration,
							ease
						},
						'move'
					)
					tl.current.fromTo(
						getCard(enteringIndex),
						hiddenRight,
						{
							...enteringEnd,
							duration: moveDuration,
							ease
						},
						'move'
					)
				} else {
					tl.current.fromTo(
						getCard(enteringIndex),
						hiddenLeft,
						{
							...enteringEnd,
							duration: moveDuration,
							ease
						},
						'move'
					)
					tl.current.fromTo(
						getCard(activeIndex),
						large,
						{
							...small,
							duration: moveDuration,
							ease
						},
						'move'
					)
					tl.current.fromTo(
						getCard(exitingIndex),
						small,
						{
							...exitingEnd,
							duration: moveDuration,
							ease
						},
						'move'
					)
				}

				if (enteringContent) {
					tl.current.to(
						enteringContent,
						{
							autoAlpha: 1,
							duration: fadeDuration,
							ease: 'power2.out'
						},
						'>'
					)
				}
			})
		},
		[
			activeIndex,
			getCard,
			getContent,
			isAnimating,
			maxActiveIndex,
			setCardLayout,
			slides.length,
			syncRestLayout
		]
	)

	const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
		if (isInteractiveTarget(event.target)) {
			return
		}

		event.currentTarget.setPointerCapture(event.pointerId)
		didDrag.current = false
		drag.current = {
			pointerId: event.pointerId,
			triggered: false,
			x: event.clientX,
			y: event.clientY
		}
	}, [])

	const onPointerMove = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			if (!drag.current || drag.current.triggered) {
				return
			}

			const deltaX = event.clientX - drag.current.x
			const deltaY = event.clientY - drag.current.y

			if (Math.abs(deltaX) < 32 || Math.abs(deltaX) < Math.abs(deltaY)) {
				return
			}

			drag.current.triggered = true
			didDrag.current = true
			event.preventDefault()
			animate(deltaX < 0 ? 'next' : 'prev')
			resetDragClickGuard(didDrag)
		},
		[animate]
	)

	const onPointerUp = useCallback(
		(event: PointerEvent<HTMLDivElement>) => {
			if (!drag.current) {
				return
			}

			if (event.currentTarget.hasPointerCapture(drag.current.pointerId)) {
				event.currentTarget.releasePointerCapture(drag.current.pointerId)
			}

			const deltaX = event.clientX - drag.current.x
			const deltaY = event.clientY - drag.current.y
			const wasTriggered = drag.current.triggered
			drag.current = null

			if (wasTriggered) {
				return
			}

			if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) {
				return
			}

			didDrag.current = true
			event.preventDefault()
			animate(deltaX < 0 ? 'next' : 'prev')
			resetDragClickGuard(didDrag)
		},
		[animate]
	)

	const onClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
		if (!didDrag.current) {
			return
		}

		event.preventDefault()
		event.stopPropagation()
	}, [])

	useEffect(() => {
		return () => {
			tl.current?.kill()
		}
	}, [])

	if (!slides.length) {
		return null
	}

	return (
		<div className={$.slider}>
			<div className={$.slider_arrows}>
				<ButtonIcon
					aria-label='Previous slide'
					className={clsx($.slider_arrow, $.slider_arrow_prev)}
					disabled={!canScrollPrev}
					onClick={() => animate('prev')}
					size='medium'
					type='button'
					variant='outline'>
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
				</ButtonIcon>
				<ButtonIcon
					aria-label='Next slide'
					className={clsx($.slider_arrow, $.slider_arrow_next)}
					disabled={!canScrollNext}
					onClick={() => animate('next')}
					size='medium'
					type='button'
					variant='outline'>
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
				</ButtonIcon>
			</div>

			<div
				className={$.slider_stage}
				onPointerCancel={(event) => {
					if (
						drag.current &&
						event.currentTarget.hasPointerCapture(drag.current.pointerId)
					) {
						event.currentTarget.releasePointerCapture(drag.current.pointerId)
					}

					drag.current = null
				}}
				onClickCapture={onClickCapture}
				onDragStart={(event) => event.preventDefault()}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}>
				{slides.map((slide, index) => (
					<div
						className={$.slider_card}
						key={index}
						ref={(node) => {
							cardRefs.current[index] = node
						}}>
						<div className={$.slider_card_inner}>{slide}</div>
					</div>
				))}
			</div>
		</div>
	)
}
