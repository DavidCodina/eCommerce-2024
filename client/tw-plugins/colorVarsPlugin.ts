import plugin from 'tailwindcss/plugin'

/* ========================================================================
                            colorVarsPlugin
======================================================================== */

export const colorVarsPlugin = plugin(function (pluginApi) {
  // Here we can create a plugin using addBase, addComponents, or addUtilities.
  const { addBase, theme } = pluginApi

  const colors = theme('colors')
  type Colors = typeof colors

  // https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574
  // Before finding this function, I was defining them all manually
  // For example: /'--tw-slate-500': config('theme.colors.slate.500'),
  function createColorVariables(colors: Colors, colorGroup = '') {
    if (!colors) {
      return {}
    }

    return Object.keys(colors).reduce((vars, colorKey) => {
      const value = colors[colorKey]

      const newVars: any =
        typeof value === 'string'
          ? { [`--tw${colorGroup}-${colorKey}`]: value }
          : createColorVariables(value, `-${colorKey}`)

      return { ...vars, ...newVars }
    }, {})
  }

  const colorVariables = createColorVariables(colors)

  addBase({
    // Tailwind doesn't automatically generate color variables...
    ':root': {
      '--tw-body-color': 'rgb(237, 242, 249)', // Custom
      // Used by MainLayout & Menu
      '--tw-dark-body-color': "theme('colors.slate.900')",
      // Used by MainLayout
      '--tw-dark-text-color': '#fff',
      // Used by Card (border), Tooltip (border), etc.
      '--tw-dark-primary-color': "theme('colors.cyan.400')",
      '--tw-dark-nav-link-hover-color': "theme('colors.pink.500')",
      // Used by Card, Tooltip, etc.
      // This is lighter than --tw-dark-body-color.
      // It's used to accentuate Card backgrounds, etc.
      '--tw-dark-bg-color': "theme('colors.slate.800')",
      // Used by Card
      '--tw-dark-shadow-color': "theme('colors.neutral.950')",
      // We no longer need to define them manually...
      // '--tw-slate-500': config('theme.colors.slate.500'),
      ...colorVariables
    }
  })
})
