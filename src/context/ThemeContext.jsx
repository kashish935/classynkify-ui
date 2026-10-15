import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'theme'
const ThemeContext = createContext(null)

const getStored = () => {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    return t === 'light' || t === 'dark' || t === 'system' ? t : 'system'
  } catch {
    return 'system'
  }
}

const systemPrefersDark = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const resolve = (theme) =>
  theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme

const apply = (resolved) => {
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  root.style.colorScheme = resolved
}

// Apply right away at import time so the first paint already has the right theme
apply(resolve(getStored()))

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStored)
  const [resolvedTheme, setResolvedTheme] = useState(() => resolve(getStored()))

  useEffect(() => {
    const update = () => {
      const r = resolve(theme)
      setResolvedTheme(r)
      apply(r)
    }
    update()

    // In "system" mode, follow the device setting live
    if (theme === 'system' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', update)
      return () => mq.removeEventListener('change', update)
    }
  }, [theme])

  const setTheme = useCallback((t) => {
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      // storage unavailable, the theme still works for this session
    }
    setThemeState(t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)