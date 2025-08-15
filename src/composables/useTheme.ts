import { ref } from 'vue'

export type ThemeName = 'dark' | 'neon' | 'pastel' | 'classic'
const THEME_KEY = 'app_theme'

export const theme = ref<ThemeName>((localStorage.getItem(THEME_KEY) as ThemeName) || 'dark')

export function applyTheme(name: ThemeName) {
  theme.value = name
  document.documentElement.setAttribute('data-theme', name)
  localStorage.setItem(THEME_KEY, name)
}

// initial apply
applyTheme(theme.value)
