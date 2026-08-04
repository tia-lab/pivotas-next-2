'use client'
import { ServiceFragment } from '@/queries'
import clsx from 'clsx'
import { FragmentOf, readFragment } from 'gql.tada'
import { useRef } from 'react'
import { Svgs } from '../Svgs'
import $ from './style.module.scss'

type Service = FragmentOf<typeof ServiceFragment>

export const CardService = ({ data }: { data: Service }) => {
	const item = readFragment(ServiceFragment, data)
	const ref = useRef<HTMLDivElement>(null)

	return (
		<article
			className={$.item}
			key={item.id ?? `${item.title}-${item.id}`}
			ref={ref}>
			<svg
				data-line
				width='100%'
				height='1'
				viewBox='0 0 100 2'
				preserveAspectRatio='none'
				className={clsx($.line, $.top)}
				aria-hidden='true'>
				<line x1='0' y1='1' x2='100' y2='1' stroke='currentColor' strokeWidth='1' />
			</svg>
			<div className={$.content}>
				{item.title ? <h3 className='title-h4'>{item.title}</h3> : null}
				{item.description ? <p>{item.description}</p> : null}
				<Svgs type='logoRound' />
			</div>
			<svg
				width='100%'
				height='1'
				viewBox='0 0 100 2'
				preserveAspectRatio='none'
				className={clsx($.line)}
				aria-hidden='true'>
				<line x1='0' y1='1' x2='100' y2='1' stroke='currentColor' strokeWidth='1' />
			</svg>
		</article>
	)
}
