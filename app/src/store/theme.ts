import { config } from '$/config'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeName = keyof typeof config.colors.themes

export type StateTheme = {
	theme: ThemeName
}

type Action = {
	updateTheme: (theme: StateTheme['theme']) => void
	switchTheme: () => void
}

type Themetore = StateTheme & Action

// Create your store, which includes both state and (optionally) actions
export const useThemeStore = createStore<Themetore>()(
	persist(
		(set) => ({
			theme: config.theme.default,
			updateTheme: (theme) => set(() => ({ theme: theme })),
			switchTheme: () =>
				set((state) => {
					const themes = Object.keys(config.colors.themes) as ThemeName[]
					const currentIndex = themes.indexOf(state.theme)
					const nextTheme = themes[(currentIndex + 1) % themes.length] ?? state.theme

					return { theme: nextTheme }
				})
		}),
		{ name: 'theme' }
	)
)
