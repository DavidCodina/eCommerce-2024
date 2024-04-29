// Custom imports
import { CSSProperties, ComponentProps, ElementType, ReactNode } from 'react'
import { useThemeContext } from 'contexts'
import { twMerge } from 'tailwind.config'

// https://levelup.gitconnected.com/create-more-extensible-react-components-with-the-as-prop-pattern-b79bcbcf4024
// https://stevekinney.github.io/react-and-typescript/polymorphic-components

type TitleOwnProps<T extends ElementType = ElementType> = {
  as?: T
  children: ReactNode
  className?: string
  color?: string
  style?: CSSProperties
}

// TitleProps includes everything in TitleOwnProps & combines that with
// everything that is in the React component the E represents, minus
// the ones that we define.
type TitleProps<U extends ElementType> = TitleOwnProps<U> &
  Omit<ComponentProps<U>, keyof TitleOwnProps>

const defaultElement = 'h1'

/* =============================================================================
                                Title
============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// The implementation of Title highlights the nature of the cascade in Tailwind
// projects. Generally, we want Tailwind to be load first, then any component-specific
// stylesheets. Finally, we want React inline styles to have the highest level of
// priority. Generally, we do NOT want to set important:true in tailwind.config.js.
//
// All of that being the case, it means that any component-level styles.css will
// have a stronger priority than any Tailwind classes with equal specificity.
// This is why we generally want to AVOID USING COMPONENT stylesheets in Tailwind
// projects. Why? Because it will block any similar Tailwind styles.
//
////////////////////////////////////////////////////////////////////////////////

export function Title<E extends ElementType = typeof defaultElement>(
  props: TitleProps<E>
) {
  const { mode } = useThemeContext()

  // Initially, I tried destructuring from within the function args, but
  // Typescript gets confused about Component.
  const {
    as: Component = defaultElement,
    children,
    color: _color = '',
    className = '',
    style = {}
  } = props

  // In this case, it just so happens that I want the same default color when light/dark.
  const color = _color
    ? _color
    : mode === 'dark'
    ? 'var(--tw-dark-primary-color)'
    : 'var(--tw-dark-primary-color)'

  /* ======================
        getClassName()
  ====================== */

  const getClassName = () => {
    const base = `
      m-0
      dark:text-[var(--tw-dark-bg-color)]
      text-white 
      font-black 
      tracking-[1px]
      leading-none
      uppercase
      font-['Poppins']
      transition-[background-color,color,text-shadow]
      duration-300
      ease-linear
    `

    const _className = twMerge(base, className)

    return _className
  }

  /* ======================
          return
  ====================== */

  return (
    <Component
      className={getClassName()}
      style={
        {
          // If the user explicitly passes in a color, then it will be used always.
          // If they want it to change based on mode, then they need to handle that
          // on the consuming side.
          WebkitTextStrokeColor: color,
          WebkitTextStrokeWidth: 1,
          textShadow:
            mode === 'dark'
              ? `
        0 1px 0 hsl(217, 0%, 20%), 
        0 2px 0 hsl(217, 0%, 19%),
        0 3px 0 hsl(217, 0%, 18%), 
        0 4px 0 hsl(217, 0%, 17%),
        0 5px 0 hsl(217, 0%, 16%), 
        0 6px 0 hsl(217, 0%, 15%),
        0 7px 0 hsl(3217, 0%, 14%), 
        0 8px 0 hsl(217, 0%, 14%),
        0px 10px 2px rgba(16, 16, 16, 0.2),
        0px 12px 4px rgba(16, 16, 16, 0.2)
        `
              : `
        0 1px 0 hsl(174, 5%, 86%),
        0 2px 0 hsl(174, 5%, 84%),
        0 3px 0 hsl(174, 5%, 82%),
        0 4px 0 hsl(174, 5%, 80%),
        0 5px 0 hsl(174, 5%, 78%),
        0 6px 0 hsl(174, 5%, 76%),
        0 7px 0 hsl(174, 5%, 74%),
        0 8px 0 hsl(174, 5%, 72%),
        0 9px 0 ${color},
        0px 10px 2px rgba(16, 16, 16, 0.2),
        0px 12px 4px rgba(16, 16, 16, 0.2)
        `,
          ...style
        } as CSSProperties
      }
    >
      {children}
    </Component>
  )
}
