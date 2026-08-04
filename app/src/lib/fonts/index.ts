import localFont from 'next/font/local'

const primary = localFont({
	src: [
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Thin.ttf',
			weight: '100',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-ThinItalic.ttf',
			weight: '100',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-ExtraLight.ttf',
			weight: '200',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-ExtraLightItalic.ttf',
			weight: '200',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Light.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-LightItalic.ttf',
			weight: '300',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Italic.ttf',
			weight: '400',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-MediumItalic.ttf',
			weight: '500',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-SemiBold.ttf',
			weight: '600',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-SemiBoldItalic.ttf',
			weight: '600',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Bold.ttf',
			weight: '700',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-BoldItalic.ttf',
			weight: '700',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-ExtraBold.ttf',
			weight: '800',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-ExtraBoldItalic.ttf',
			weight: '800',
			style: 'italic'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-Black.ttf',
			weight: '900',
			style: 'normal'
		},
		{
			path: './Be_Vietnam_Pro/BeVietnamPro-BlackItalic.ttf',
			weight: '900',
			style: 'italic'
		}
	],
	variable: '--font-primary',
	fallback: ['Arial', 'sans-serif'],
	display: 'swap',
	preload: true
})

const secondary = localFont({
	src: [
		{
			path: './Larken/larken-400.woff2',
			weight: '400',
			style: 'normal'
		},
		{
			path: './Larken/larken-400-italic.woff2',
			weight: '400',
			style: 'italic'
		},
		{
			path: './Larken/larken-700.woff2',
			weight: '700',
			style: 'normal'
		},
		{
			path: './Larken/larken-700-italic.woff2',
			weight: '700',
			style: 'italic'
		}
	],
	variable: '--font-secondary',
	fallback: ['Arial', 'sans-serif'],
	display: 'swap',
	preload: true
})

export const fonts = {
	primary,
	secondary
}
