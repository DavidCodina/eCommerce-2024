// Third-party imports
import { forwardRef, ElementType } from 'react'

// https://github.com/epicweb-dev/epic-stack/issues/301
// If your tailwind.config.js contains custom classes, then
// you need to create a custom twMerge(). Otherwise, the
// default twMerge() exhibits buggy behavior. For example,
// when I tried using 'text-xxs', it ended up dropping 'text-white'.
// See tailwind.config.js..
import { twMerge } from 'tailwind.config'

import {
  ButtonComponent,
  ButtonProps,
  defaultElement,
  PolymorphicRef
} from './types'

/* ========================================================================
                              Button
======================================================================== */
//# It's important that when we go to build out the Input styles that
//# the sizes match those of Button.

export const Button: ButtonComponent = forwardRef(
  <C extends ElementType = typeof defaultElement>(
    {
      as,
      children,
      className = '',
      color = 'blue', //! ???
      loading = false,
      onClick,
      pill = false,
      size: _size, // = undefined,
      style = {},
      variant,
      ...rest
    }: ButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || defaultElement
    const otherProps: any = { ...rest }
    const size = _size === 'md' ? 'base' : _size

    // The only downside here is that unshaded colors are hardcoded internally.
    const unshaded = ['black', 'white', 'dark', 'light']

    /* ======================
        getClassName()
    ====================== */

    const getClassName = () => {
      const base = `
      group 
      relative
      leading-normal
      text-center
      no-underline
      align-middle
      font-bold
      select-none
      border
      outline-none
      transition-[background-color,border,box-shadow,color]${
        loading ? ' pointer-events-none opacity-70' : ''
      }
      `

      // 'text-black' is a little too strong.
      const textColor =
        color === 'light' || color === 'white'
          ? 'text-neutral-700'
          : 'text-white'

      // If no size prop is explicitly passed, then default to ''.
      // This sets the default size to whatever the inherited
      // size is. If nothing else intervenes, then this will be
      // the <body> size, which is fluidly defined in the TW config.
      const fontSize = size ? `text-${size}` : ''
      const padding = 'px-[0.75em] py-[0.375em]'

      const backgroundColor = unshaded.includes(color)
        ? `bg-${color}`
        : `bg-${color}-500`

      const borderColor = (() => {
        if (unshaded.includes(color)) {
          // Hacky hardcoding, but works for me...

          if (color === 'black') {
            return `border-${color} dark:border-neutral-800`
          }

          if (color === 'white') {
            // If we were being consistent, this would be
            // return `border-neutral-100 dark:border-${color}`
            // But here I've split the difference between neutral-100 and neutral-200
            return `border-[rgb(236,236,236)] dark:border-${color}`
          }

          if (color === 'dark') {
            return 'border-black dark:border-neutral-700'
          }

          if (color === 'light') {
            return 'border-neutral-200 dark:border-white'
          }

          // Catch all others...
          return `border-${color} dark:border-${color}`
        }

        return `border-${color}-600 dark:border-${color}-400`
      })()

      const borderRadius = pill ? 'rounded-full' : 'rounded-[0.25em]'

      const focusStyle = `focus:shadow-focus-${color}`

      ///////////////////////////////////////////////////////////////////////////
      //
      // Initially, I had styles like this:
      //
      //   green: 'active:bg-green-700 active:border-green-800 active:text-white',
      //
      // However, rather than changing the color to even darker tints, I decided
      // instead to just apply active:scale-[0.98].
      //
      // It would be cool to set an inset box-shadow as well:
      // active:shadow-[inset_0px_0px_2px_rgba(0,0,0,0.5)]
      // Unfortunately, 'transition-all' doesn't seem to work well with custom shadow.
      // Actually, from what I've read, the problem is not with Tailwind but with the CSS.
      // box-shadow non-inset can't transition to inset.
      //
      ///////////////////////////////////////////////////////////////////////////
      const activeStyle = 'active:scale-95'

      if (otherProps?.disabled === true) {
        const _disabledClassName = twMerge(
          `
        pointer-events-none
        ${base}
        text-neutral-400
        ${fontSize}
        ${padding}
        bg-neutral-100
        border-neutral-300
        ${borderRadius}
        `,
          className
        )

        return _disabledClassName
      }

      const _className = twMerge(
        `${base} ${textColor} ${fontSize} ${padding} ${backgroundColor} ${borderColor} ${borderRadius} ${focusStyle} ${activeStyle}`,
        className
      )

      return _className
    }

    /* ======================
      getOutlineClassName()
    ====================== */

    const getOutlineClassName = () => {
      // outline-none should be fine. It wouldn't show up in Safari anyways,
      // and in Chrome the focus shadow suffices.
      const base = `
      group
      relative
      leading-normal
      text-center
      no-underline
      align-middle
      font-bold
      select-none
      border
      outline-none
      transition-[background-color,border,box-shadow,color]${
        loading ? ' pointer-events-none opacity-70' : ''
      }`

      const textColor = unshaded.includes(color)
        ? `text-${color}`
        : `text-${color}-500`

      // If no size prop is explicitly passed, then default to ''.
      // This sets the default size to whatever the inherited
      // size is. If nothing else intervenes, then this will be
      // the <body> size, which is fluidly defined in the TW config.
      const fontSize = size ? `text-${size}` : ''

      const padding = 'px-[0.75em] py-[0.375em]'
      const backgroundColor = 'bg-transparent'

      const borderColor = unshaded.includes(color)
        ? `border-${color}`
        : `border-${color}-500`

      const borderRadius = pill ? 'rounded-full' : 'rounded-[0.25em]'

      const hoverStyle = (() => {
        if (unshaded.includes(color)) {
          if (color === 'black') {
            return `hover:bg-black hover:border-black hover:text-white dark:hover:border-neutral-800`
          }

          if (color === 'white') {
            return `hover:bg-white hover:border-[rgb(236,236,236)] hover:text-neutral-700 dark:hover:border-white`
          }

          if (color === 'dark') {
            return `hover:bg-dark hover:border-black hover:text-white dark:hover:border-neutral-700`
          }

          if (color === 'light') {
            return `hover:bg-light hover:border-neutral-200 hover:text-neutral-700 dark:hover:border-white`
          }
        }

        return `hover:bg-${color}-500 hover:border-${color}-600 hover:text-white dark:hover:border-${color}-400`
      })()

      const focusStyle = (() => {
        if (unshaded.includes(color)) {
          if (color === 'black') {
            return `focus:bg-black focus:border-black focus:text-white focus:shadow-focus-${color} dark:focus:border-neutral-800`
          }

          if (color === 'white') {
            return `focus:bg-white focus:border-[rgb(236,236,236)] focus:text-neutral-700 focus:shadow-focus-${color} dark:focus:border-white`
          }

          if (color === 'dark') {
            return `focus:bg-dark focus:border-black focus:text-white focus:shadow-focus-${color} dark:focus:border-neutral-700`
          }

          if (color === 'light') {
            return `focus:bg-light focus:border-neutral-200 focus:text-neutral-700 focus:shadow-focus-${color} dark:focus:border-white`
          }
        }

        return `focus:bg-${color}-500 focus:border-${color}-600 focus:shadow-focus-${color} focus:text-white dark:focus:border-${color}-400`
      })()

      const activeStyle = 'active:scale-95'

      if (otherProps?.disabled === true) {
        const _disabledClassName = twMerge(
          `pointer-events-none
        ${base}
        text-neutral-400
        ${fontSize}
        ${padding}
        bg-neutral-100 bg-opacity-20
        border-neutral-400
        ${borderRadius}
        `,
          className
        )

        return _disabledClassName
      }

      const _className = twMerge(
        `
      ${base}
      ${textColor}
      ${fontSize}
      ${padding}
      ${backgroundColor}
      ${borderColor}
      ${borderRadius}
      ${hoverStyle}
      ${focusStyle}
      ${activeStyle}
      `,
        className
      )

      return _className
    }

    /* ======================
            return
    ====================== */

    return (
      <Component
        onClick={loading || otherProps?.disabled ? undefined : onClick}
        className={
          variant === 'outline' ? getOutlineClassName() : getClassName()
        }
        ref={ref}
        style={{
          // This doesn't look quite as good on the outline button.
          textShadow:
            otherProps?.disabled || variant === 'outline'
              ? ''
              : '0px 0px 0.03125em rgba(0,0,0,0.35), 0px 0px 0.03125em rgba(0,0,0,0.35)',
          ...style
        }}
        {...otherProps}
      >
        <div
          // One could use this instead: group-hover:bg-[rgba(0,0,0,0.05)]
          // However, backdrop-filter is a better tool for the job.
          className={`
            absolute 
            inset-0 
            ${
              variant === 'outline'
                ? ''
                : color === 'white' || color === 'light'
                ? 'group-hover:backdrop-brightness-[.98]'
                : 'group-hover:backdrop-brightness-95'
            }
          `}
          style={{ borderRadius: 'inherit' }} // Can this be done with Tailwind using arbitrary values?
        />

        {/* Position text on top of backdrop. */}
        <span
          className='relative flex items-center justify-center'
          style={{ zIndex: 1 }}
        >
          {loading && (
            <div
              className={`spinner-border spinner-border-dynamic${
                children ? ` mr-[0.35em]` : ''
              }`}
              role='status'
              style={{}}
            >
              <span className='sr-only'>Loading...</span>
            </div>
          )}

          {children}
        </span>

        {otherProps.disabled && (
          <svg
            className='opacity-50 dark:opacity-70'
            style={{
              height: '1.75em',
              fill: '#FF355E',
              filter: 'drop-shadow(0px 1px 0.5px rgba(0,0,0,0.5))',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
            viewBox='0 0 512 512'
          >
            <path d='M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z' />
          </svg>
        )}
      </Component>
    )
  }
)

/* Consider using a custom spinner for Button:
  
  <svg
    // Adjust color and size here as needed.
    className='h-10 w-10 animate-spin text-black'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    ></circle>

    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    ></path>
  </svg>
  
*/
