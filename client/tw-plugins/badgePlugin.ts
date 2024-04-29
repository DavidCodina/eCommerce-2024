import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              badgePlugin
======================================================================== */
// Could have a filled version in addition to outline version - like Mantine.
// At present these are sort of a outline/filled hybrid.

///////////////////////////////////////////////////////////////////////////
//
// Usage: Go to your tailwind.config.js and do:
//
//   plugins: [badgePlugin, ... ]
//
// Test with:
//
// <div className='flex flex-wrap items-center justify-center gap-2'>
//   <span className='badge-red hover:badge-green'>Red Badge</span>
//   <span className='badge-orange'>Orange Badge</span>
//   <span className='badge-amber'>Amber Badge</span>
//   <span className='badge-yellow'>Yellow Badge</span>
//   <span className='badge-lime'>Lime Badge</span>
//   <span className='badge-green'>Green Badge</span>
//   <span className='badge-emerald'>Emerald Badge</span>
//   <span className='badge-teal'>Teal Badge</span>
//   <span className='badge-cyan'>Cyan Badge</span>
//   <span className='badge-sky'>Sky Badge</span>
//   <span className='badge-blue'>Blue Badge</span>
//   <span className='badge-indigo'>Indigo Badge</span>
//   <span className='badge-violet'>Violet Badge</span>
//   <span className='badge-purple'>Purple Badge</span>
//   <span className='badge-fuchsia'>Fuchsia Badge</span>
//   <span className='badge-pink'>Pink Badge</span>
//   <span className='badge-rose'>Rose Badge</span>
//   <span className='badge-brown'>Brown Badge</span>

//   <span className='badge-slate'>Slate Badge</span>
//   <span className='badge-gray'>Gray Badge</span>
//   <span className='badge-zinc'>Zinc Badge</span>
//   <span className='badge-neutral'>Neutral Badge</span>
//   <span className='badge-stone'>Stone Badge</span>
// </div>
//
///////////////////////////////////////////////////////////////////////////

export const badgePlugin = plugin(function (pluginApi) {
  // Here we can create a plugin using addBase, addComponents, or addUtilities.
  const { addComponents, theme } = pluginApi

  const colors = theme('colors')
  type Colors = typeof colors

  function createBadgeClasses(colors: Colors) {
    if (!colors) {
      return
    }

    return Object.keys(colors).reduce((badgeClasses, colorKey) => {
      const value = colors[colorKey]

      if (typeof value !== 'object') {
        return badgeClasses
      }

      // If the typeof value is an object, then we know it's a color with
      // shades (i.e., not inherit, currentColor, transparent, black, white)
      // In that case, dynamically generate a newBadgeClass.
      const newBadgeClass = {
        [`.badge-${colorKey}`]: {
          lineHeight: theme('lineHeight.none'),
          padding: `${theme('spacing[0.5]')} ${theme('spacing.1')}`,
          backgroundColor: theme(`colors.${colorKey}.200`),
          color: theme(`colors.${colorKey}.700`),
          borderRadius: theme('borderRadius.lg'),
          border: `1px solid ${theme(`colors.${colorKey}.700`)}`,
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.bold')
        }
      }

      return { ...badgeClasses, ...newBadgeClass }
    }, {})
  }

  const badgeClasses = createBadgeClasses(colors)

  // Will log to terminal not browser: console.log(badgeClasses)
  // Because this is being added as a comonent, we can still overwrite it with utility classes.
  addComponents({ ...badgeClasses })
})
