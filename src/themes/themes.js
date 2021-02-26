import { useState, useCallback } from 'preact/hooks'

import '~/src/style/themes.css'

const themes = [
  'default',
  'default-dark',
  'nord',
  'solarized-dark',
  'solarized-light',
  '_raw'
]

const DEFAULT_THEME = themes[0]

const assertTheme = theme =>
  themes.includes(theme)
    ? theme
    : DEFAULT_THEME

export const useThemeEngine = (initialTheme = DEFAULT_THEME) => {
  const [currentTheme, setCurrentTheme] =
    useState(initialTheme)

  const setTheme = useCallback(theme => {
    setCurrentTheme(assertTheme(theme))
  }, [currentTheme])

  return { currentTheme, setTheme, themes }
}