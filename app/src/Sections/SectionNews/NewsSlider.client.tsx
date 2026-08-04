'use client'

import { ButtonIcon } from '@/Components/ButtonIcon'
import { Slider } from '@/Components/Slider'
import clsx from 'clsx'
import { type ReactNode } from 'react'
import $ from './style.module.scss'

export const NewsSlider = ({ children }: { children: ReactNode }) => (
	<Slider
		classes={{ controls: $.slider_controls, slide: $.slider_slide }}
		className={$.slider}
		gap='0rem'
		renderControls={(slider) => (
			<>
				<div className={$.slider_arrows}>
					<ButtonIcon
						aria-label='Previous slide'
						className={clsx($.slider_arrow, $.slider_arrow_prev)}
						disabled={!slider.canScrollPrev}
						onClick={slider.scrollPrev}
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
						disabled={!slider.canScrollNext}
						onClick={slider.scrollNext}
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
				{/* <div aria-hidden='true' className={$.slider_progress}>
					<div
						className={$.slider_progress_bar}
						style={{ transform: `scaleX(${slider.progress})` }}
					/>
				</div> */}
			</>
		)}
		slidesPerView={3}>
		{children}
	</Slider>
)
