import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              popoverPlugin
======================================================================== */

export const popoverPlugin = plugin(function (pluginApi) {
  const { addComponents /* , theme */ } = pluginApi

  addComponents({
    '.radix-popover-content': {
      '--radix-popover-bg-color': '#fff',
      '--radix-popover-border-color': 'theme(colors.neutral.500)',
      '--radix-popover-close-color': 'theme(colors.neutral.500)',
      '--radix-popover-close-hover-color': 'theme(colors.neutral.900)',
      '--radix-popover-close-position': '2px',
      backgroundColor: 'var(--radix-popover-bg-color)',
      border: '1px solid var(--radix-popover-border-color)',
      borderRadius: 'theme(borderRadius.DEFAULT)',
      padding: 'theme(spacing.2)',
      fontSize: 'theme(fontSize.xs)',
      lineHeight: '1.25', // leading-tight
      boxShadow: 'theme(boxShadow.DEFAULT)'
    },

    '.radix-popover-arrow': {
      fill: 'var(--radix-popover-bg-color)',
      filter: `drop-shadow(0px 1.5px 0px var(--radix-popover-border-color))`
    },

    '.radix-popover-close-btn': {
      position: 'absolute',
      top: 'var(--radix-popover-close-position)',
      right: 'var(--radix-popover-close-position)',

      '&:focus': {
        boxShadow: 'none'
      },

      svg: {
        fill: 'var(--radix-popover-close-color)'
      },

      '&:hover svg': {
        fill: 'var(--radix-popover-close-hover-color)'
      }
    }
  })
})
