import { ref, watch } from 'vue'
import { Preferences } from '@capacitor/preferences'
import { applyTheme, theme as themeRef, type ThemeName } from '@/composables/useTheme'

const K_THEME = 'pref_theme'
const K_OWNER_ONLY = 'pref_owner_only'
const K_LANG = 'pref_lang'

export const ownerOnlyDefault = ref<boolean>(false)
export const lang = ref<'fr'|'en'>('fr')

// Charge depuis le stockage natif
;(async () => {
  const t = (await Preferences.get({ key: K_THEME })).value as ThemeName | null
  if (t) { applyTheme(t) }

  const o = (await Preferences.get({ key: K_OWNER_ONLY })).value
  if (o != null) ownerOnlyDefault.value = o === 'true'

  const l = (await Preferences.get({ key: K_LANG })).value as 'fr'|'en'|null
  if (l) lang.value = l
})()

// Persistance auto
watch(themeRef, (v) => Preferences.set({ key: K_THEME, value: v }))
watch(ownerOnlyDefault, (v) => Preferences.set({ key: K_OWNER_ONLY, value: String(v) }))
watch(lang, (v) => Preferences.set({ key: K_LANG, value: v }))
