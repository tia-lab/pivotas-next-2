'use client'

import { Slider } from '@/Components/Slider'
import type { ReactNode } from 'react'
import $ from './style.module.scss'

export const ImageSlider = ({ children }: { children: ReactNode }) => (
	<Slider
		classes={{ controls: $.controls }}
		controls
		dots
		gap='0.25rem'
		slideSize='min(85vw, 46rem)'>
		{children}
	</Slider>
)
