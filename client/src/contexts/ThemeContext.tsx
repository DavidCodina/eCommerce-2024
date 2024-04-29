import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'

export interface ThemeContextValue {
  mode: 'light' | 'dark'
  setMode: Dispatch<SetStateAction<'light' | 'dark'>>
  // [key: string]: any
}

/* ========================================================================

======================================================================== */
// https://tailwindcss.com/docs/dark-mode
// https://www.youtube.com/watch?v=oMOe_32M6ss

///////////////////////////////////////////////////////////////////////////
//
// The Tailwind light/dark theme feature works in conjunction with several other files.
// - tailwind.config.js sets: darkMode: 'class'.
// - styles/dark.css
// - <ThemeProvider> is consumed in RootLayout/.
// - It's consumed  in MainLayout/ through useThemeContext()
// - const { mode, setMode } = useThemeContext() is also consumed in MainLayout/components/Menu.tsx
// - useThemeContext() is also (or should be) baked into various custom components like
//   Title, HR, Card, Modal, Spinner, etc.
//
//# - ❓ Tabs
//
// Ultimately, Whether a website will need a 'light/dark' feature is something that should
// ideally be determined from the outset. Otherwise, adding it in later is kind of
// a pain because you have to go back and update a bunch of component styles.
//
///////////////////////////////////////////////////////////////////////////

export const ThemeContext = createContext({} as ThemeContextValue)
export const ThemeConsumer = ThemeContext.Consumer

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const firstRenderRef = useRef(true)

  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const maybeMode = localStorage.getItem('mode')
    if (maybeMode === 'light' || maybeMode === 'dark') {
      return maybeMode
    }
    return prefersDarkMode ? 'dark' : 'light'
  })

  /* ======================
        useEffect()
  ====================== */
  // https://betterprogramming.pub/using-window-matchmedia-in-react-8116eada2588
  // When the user changes changes their system preference for dark mode,
  // then update mode accordingly.

  useEffect(() => {
    const mediaWatcher = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: any) => {
      if (e.currentTarget.matches === true) {
        // console.log('The user now prefers a prefers a dark color scheme.')
        setMode('dark')
      } else {
        // console.log('The user now  does NOT prefer a dark color scheme.')
        setMode('light')
      }
    }
    mediaWatcher.addEventListener('change', handleChange)
    return () => {
      mediaWatcher.removeEventListener('change', handleChange)
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */
  // Update the <html> element's classList whenenver mode changes.
  // There was a flash that occurs on mount when the theme switches on mont.
  // This is one of those rare cases where useLayoutEffect() is needed.

  useLayoutEffect(() => {
    const html = document.getElementsByTagName('html')?.[0]
    if (firstRenderRef.current === true && html) {
      // .transition-none-all is hardcoded into index.html to prevent
      // the light/dark transition on mount.
      setTimeout(() => {
        html.classList.remove('transition-none-all')
      }, 1000)
    }
    firstRenderRef.current = false

    if (html) {
      if (mode === 'dark') {
        localStorage.setItem('mode', 'dark')
        if (!html.classList.contains('dark')) {
          html.classList.add('dark')
        }
      } else {
        localStorage.setItem('mode', 'light')
        html.classList.remove('dark')
      }
    }
  }, [mode])

  /* ======================
          return
  ====================== */

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const value = useContext(ThemeContext)
  return value
}
