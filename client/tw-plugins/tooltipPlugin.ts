import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              tooltipPlugin
======================================================================== */
// Why bother using a plugin for this? By using a Tailwind plugin it
// puts the styles in the @tailwind components section, which means
// passing utility classes during consumption will not create CSS conflicts.
// The alternative is to use Tailwind Merge or Tailwind Variants, but it's better
// to avoid having to use those.

export const tooltipPlugin = plugin(function (pluginApi) {
  const { addComponents /* , theme */ } = pluginApi

  addComponents({
    '.radix-tooltip-content': {
      '--radix-tooltip-bg-color': '#fff',
      '--radix-tooltip-border-color': 'theme(colors.neutral.500)',
      backgroundColor: 'var(--radix-tooltip-bg-color)',
      border: '1px solid var(--radix-tooltip-border-color)',
      borderRadius: 'theme(borderRadius.DEFAULT)',
      padding: 'theme(spacing.2)',
      fontSize: 'theme(fontSize.xs)',
      lineHeight: '1.25', // leading-tight
      boxShadow: 'theme(boxShadow.DEFAULT)'
    },
    '.radix-tooltip-arrow': {
      fill: 'var(--radix-tooltip-bg-color)',
      filter: `drop-shadow(0px 1.5px 0px var(--radix-tooltip-border-color))`
    }
  })
})
