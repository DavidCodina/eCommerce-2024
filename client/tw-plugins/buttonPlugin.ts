import plugin from 'tailwindcss/plugin'
import { lightenDarkenColor } from './utils/lightenDarkenColor'

/* ========================================================================
                              buttonPlugin
======================================================================== */

//# linkButton: this would be a whole separate function to
//# create all of the link buttons.

//! Note: The Lexical Rich Text Editor has some generic styles on its checkboxes
//! That end up bleeding into other things. That needs to be fixed in the Lexical
//! Editor.

export const buttonPlugin = plugin(function (pluginApi) {
  const { addComponents, theme } = pluginApi

  const colors = theme('colors')
  type Colors = typeof colors

  /* ======================
  createSolidButtonClasses()
  ====================== */

  function createSolidButtonClasses(colors: Colors) {
    if (!colors) {
      return
    }

    return Object.keys(colors).reduce((buttonClasses, colorKey) => {
      const value = colors[colorKey]

      if (typeof value !== 'object') {
        return buttonClasses
      }

      const hoverBackgroundColor = lightenDarkenColor(
        theme(`colors.${colorKey}.500`),
        20
      ).hex

      const hoverBorderColor = lightenDarkenColor(
        theme(`colors.${colorKey}.700`),
        20
      ).hex

      // If the typeof value is an object, then we know it's a color with
      // shades (i.e., not inherit, currentColor, transparent, black, white)
      // In that case, dynamically generate a newBadgeClass.
      const newSolidButtonClass = {
        [`.btn-${colorKey}`]: {
          backgroundColor: theme(`colors.${colorKey}.500`),
          border: `1px solid ${theme(`colors.${colorKey}.700`)}`,
          // Setting borderRadius (and padding) relative to em is much
          // simpler than trying to manage it manually.
          borderRadius: '0.25em',
          boxShadow: '0 2px 2px rgb(0,0,0,0.15)',
          color: theme(`colors.white`),
          cursor: 'pointer',
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.bold'),
          outline: 'none',

          textDecoration: 'none',
          transition: 'all 0.05s linear',
          userSelect: 'none',
          verticalAlign: 'middle',

          //* New
          padding: '0.25em 0.5em',
          // It's better to rely on lineHeight + padding, rather than
          // paddingly only. Why? If your button text wraps, you don't want
          // it to look compressed. That said, the trade-off is that if a user
          // passes in ONLY an <svg>, then the lineHeight will not be applied.
          lineHeight: theme('lineHeight.normal'),
          position: 'relative',
          alignItems: 'center',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '0.25em', // So it scales

          '&:hover': {
            backgroundColor: hoverBackgroundColor,
            borderColor: hoverBorderColor,
            color: theme(`colors.white`) // Useful when using styles on <a>.
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 0.25rem theme('colors.${colorKey}.500/50%')`
          },

          '&:active': {
            boxShadow: 'none',
            transform: 'scale(0.95)'
          },

          '&:active:focus-visible': {
            boxShadow: `0 0 0 0.25rem theme('colors.${colorKey}.500/50%')`
          },

          '&:disabled': {
            opacity: '0.65',
            pointerEvents: 'none'
          }
        },
        [`.btn-check:focus-visible + .btn-${colorKey}`]: {
          boxShadow: `0 0 0 0.25rem theme('colors.${colorKey}.500/50%')`
        }
      }

      return { ...buttonClasses, ...newSolidButtonClass }
    }, {})
  }

  /* ======================
  createOutlineButtonClasses()
  ====================== */

  function createOutlineButtonClasses(colors: Colors) {
    if (!colors) {
      return
    }

    return Object.keys(colors).reduce((buttonClasses, colorKey) => {
      const value = colors[colorKey]

      if (typeof value !== 'object') {
        return buttonClasses
      }

      const newOutlineButtonClass = {
        [`.btn-outline-${colorKey}`]: {
          backgroundColor: 'transparent',
          border: `1px solid ${theme(`colors.${colorKey}.500`)}`,
          borderRadius: '0.25em',
          boxShadow: '0 2px 2px rgb(0,0,0,0.15)',
          color: theme(`colors.${colorKey}.500`),
          cursor: 'pointer',
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.bold'),
          outline: 'none',

          textDecoration: 'none',
          transition: 'all 0.05s linear',
          userSelect: 'none',
          verticalAlign: 'middle',

          //* New
          padding: '0.25em 0.5em',
          lineHeight: theme('lineHeight.normal'),
          position: 'relative',
          alignItems: 'center',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: '0.25em', // So it scales

          '&:hover': {
            backgroundColor: theme(`colors.${colorKey}.500`),
            border: `1px solid ${theme(`colors.${colorKey}.700`)}`,
            color: theme(`colors.white`) // Useful when using styles on <a>.
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 0.25rem theme('colors.${colorKey}.500/50%')`
          },

          '&:active': {
            backgroundColor: theme(`colors.${colorKey}.500`),
            border: `1px solid ${theme(`colors.${colorKey}.600`)}`,
            color: theme(`colors.white`),
            boxShadow: 'none',
            transform: 'scale(0.95)'
          },
          '&:active:focus-visible': {
            boxShadow: `0 0 0 0.25rem theme('colors.${colorKey}.500/50%')`
          },
          '&:disabled, &:disabled:hover': {
            opacity: '0.65',
            pointerEvents: 'none'
          }
        },
        // This must be its own style...
        [`.btn-check:focus-visible + .btn-outline-${colorKey}`]: {
          boxShadow: `0 0 0 0.25rem theme('colors.${colorKey}.500/50%')`
        }
      }

      return { ...buttonClasses, ...newOutlineButtonClass }
    }, {})
  }

  /* ======================
  
  ====================== */

  const solidButtonClasses = createSolidButtonClasses(colors)
  const outlineButtonClasses = createOutlineButtonClasses(colors)

  addComponents({
    ...solidButtonClasses,
    ...outlineButtonClasses,

    /* ======================

    ====================== */

    '.btn-is-icon-only': {
      padding: '0.5em 0.5em'
    },

    /* ======================

    ====================== */

    // fontSize.xxs is a custom addition to theme.extend.fontSize in Tailwind config.
    '.btn-xxs': {
      fontSize: theme('fontSize.xxs')
    },
    '.btn-xs': {
      fontSize: theme('fontSize.xs')
    },
    '.btn-sm': {
      fontSize: theme('fontSize.sm')
    },
    '.btn-lg': {
      fontSize: theme('fontSize.lg')
    },
    '.btn-xl': {
      fontSize: theme('fontSize.xl')
    },
    '.btn-2xl': {
      fontSize: theme('fontSize.2xl')
    },
    '.btn-3xl': {
      fontSize: theme('fontSize.3xl')
    },
    '.btn-4xl': {
      fontSize: theme('fontSize.4xl')
    },
    '.btn-5xl': {
      fontSize: theme('fontSize.5xl')
    },
    '.btn-6xl': {
      fontSize: theme('fontSize.6xl')
    },
    '.btn-7xl': {
      fontSize: theme('fontSize.7xl')
    },
    '.btn-8xl': {
      fontSize: theme('fontSize.8xl')
    },
    '.btn-9xl': {
      fontSize: theme('fontSize.9xl')
    },

    /* ======================

    ====================== */

    '.btn-check': {
      position: 'absolute',
      clip: 'rect(0, 0, 0, 0)',
      pointerEvents: 'none'
    },

    '.btn-check[disabled] + [class^="btn-"], .btn-check:disabled + [class^="btn-"]':
      {
        pointerEvents: 'none',
        filter: 'none',
        opacity: '0.65'
      },

    '.btn-check:checked + [class^="btn-"]': {
      boxShadow: 'none',
      transform: 'scale(0.9)'
    },

    /* ======================

    ====================== */

    '.btn-group, .btn-group-vertical': {
      position: 'relative',
      display: 'inline-flex',
      verticalAalign: 'middle'
    },
    '.btn-group > *, .btn-group-vertical > *': {
      position: 'relative',
      flex: '1 1 auto',
      boxShadow: 'none'
    },

    '.btn-group > .btn-check:checked + *, .btn-group > .btn-check:focus + *, .btn-group > *:hover, .btn-group > *:focus, .btn-group > *:active, .btn-group > *.active, .btn-group-vertical > .btn-check:checked + *, .btn-group-vertical > .btn-check:focus + *, .btn-group-vertical > *:hover, .btn-group-vertical > *:focus, .btn-group-vertical > *:active, .btn-group-vertical > *.active':
      {
        zIndex: '1'
      },
    '.btn-group > *:not(:first-child), .btn-group > .btn-group:not(:first-child)':
      {
        marginLeft: '-1px'
      },

    '.btn-group > *:not(:last-child):not(.dropdown-toggle), .btn-group > .btn-group:not(:last-child) > *':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0'
      },

    '.btn-group > *:nth-child(n+3), .btn-group > :not(.btn-check) + *, .btn-group > .btn-group:not(:first-child) > *':
      {
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
      },
    '.btn-group-vertical': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    '.btn-group-vertical > *, .btn-group-vertical > .btn-group': {
      width: '100%'
    },
    '.btn-group-vertical > *:not(:first-child), .btn-group-vertical > .btn-group:not(:first-child)':
      {
        marginTop: '-1px'
      },
    '.btn-group-vertical > *:not(:last-child):not(.dropdown-toggle), .btn-group-vertical > .btn-group:not(:last-child) > *':
      {
        borderBottomRightRadius: '0',
        borderBottomLeftRadius: '0'
      },
    '.btn-group-vertical > * ~ *, .btn-group-vertical > .btn-group:not(:first-child) > *':
      {
        borderTopLeftRadius: '0',
        borderTopRightRadius: '0'
      },

    /* ======================

    ====================== */
    // Used by actual Button component. Initially, I used
    // '[class^="btn-"] .btn-inner' as the selector, but that
    // seems like it could potentially lead to specificity issues
    // with utility classes.

    // '.btn-inner': {
    //   alignItems: 'center',
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   justifyContent: 'center',
    //   gap: '0.25em'
    // },

    /* ======================

    ====================== */

    '.btn-close': {
      boxSizing: 'content-box',
      width: '1em',
      height: '1em',
      padding: '0.25em 0.25em',
      color: '#000',
      background: `transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat`,
      border: '0',
      borderRadius: '0.25rem',
      opacity: '0.5', // ???
      '&:hover': {
        color: '#000',
        textDecoration: 'none',
        opacity: '1'
      },
      '&:focus': {
        outline: '0',
        boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
        opacity: '1'
      },
      '&:disabled, &.disabled': {
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: '0.25'
      }
    },
    '.btn-close-white': {
      filter: 'invert(1) grayscale(100%) brightness(200%)'
    }
  })
})
