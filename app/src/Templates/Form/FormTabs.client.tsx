'use client'

import { Button } from '@/Components/Button'
import { Children, type KeyboardEvent, type ReactNode, useState } from 'react'
import $ from './style.module.scss'

type Tab = {
	id: string
	label: string
}

type Props = {
	tabs: Tab[]
	children: ReactNode
}

export const FormTabs = ({ tabs, children }: Props) => {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const panels = Children.toArray(children)
	const hasTabs = tabs.length > 1

	const selectTab = (index: number) => {
		setSelectedIndex(index)
	}

	const handleKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number
	) => {
		let nextIndex: number | null = null

		switch (event.key) {
			case 'ArrowLeft':
				nextIndex = (index - 1 + tabs.length) % tabs.length
				break
			case 'ArrowRight':
				nextIndex = (index + 1) % tabs.length
				break
			case 'Home':
				nextIndex = 0
				break
			case 'End':
				nextIndex = tabs.length - 1
				break
		}

		if (nextIndex === null) {
			return
		}

		event.preventDefault()
		selectTab(nextIndex)
		event.currentTarget
			.closest('[role="tablist"]')
			?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
			.item(nextIndex)
			.focus()
	}

	if (!tabs.length) {
		return null
	}

	return (
		<>
			{hasTabs ? (
				<div className={$.form_tabs} role='tablist' aria-label='Available forms'>
					{tabs.map((tab, index) => {
						const selected = selectedIndex === index

						return (
							<Button
								key={tab.id}
								id={`form-tab-${tab.id}`}
								size='small'
								variant={selected ? 'default' : 'outline'}
								role='tab'
								aria-label={tab.label}
								aria-controls={`form-panel-${tab.id}`}
								aria-selected={selected}
								tabIndex={selected ? 0 : -1}
								onClick={() => selectTab(index)}
								onKeyDown={(event) => handleKeyDown(event, index)}>
								{tab.label}
							</Button>
						)
					})}
				</div>
			) : null}

			<div className={$.form_scroll} data-lenis-prevent>
				{panels.map((panel, index) => {
					const tab = tabs[index]
					const selected = selectedIndex === index

					if (!hasTabs) {
						return panel
					}

					return (
						<div
							key={tab.id}
							id={`form-panel-${tab.id}`}
							role='tabpanel'
							aria-labelledby={`form-tab-${tab.id}`}
							tabIndex={0}
							hidden={!selected}>
							{panel}
						</div>
					)
				})}
			</div>
		</>
	)
}
