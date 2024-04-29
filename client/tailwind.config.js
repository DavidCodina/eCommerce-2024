import { extendTailwindMerge } from 'tailwind-merge'
import { colorVarsPlugin } from './tw-plugins/colorVarsPlugin'
import { basePlugin } from './tw-plugins/basePlugin'
import { badgePlugin } from './tw-plugins/badgePlugin'
import { buttonPlugin } from './tw-plugins/buttonPlugin'
import { alertPlugin } from './tw-plugins/alertPlugin'
import { listGroupPlugin } from './tw-plugins/listGroupPlugin'
import { spinnerPlugin } from './tw-plugins/spinnerPlugin'
import { tabsPlugin } from './tw-plugins/tabsPlugin'
import { tablePlugin } from './tw-plugins/tablePlugin'
import { modalPlugin } from './tw-plugins/modalPlugin'
import { tooltipPlugin } from './tw-plugins/tooltipPlugin'
import { popoverPlugin } from './tw-plugins/popoverPlugin'
import { dropdownPlugin } from './tw-plugins/dropdownPlugin'
import { scrollAreaPlugin } from './tw-plugins/scrollAreaPlugin'
import { accordionPlugin } from './tw-plugins/accordionPlugin'
import { formPlugin } from './tw-plugins/formPlugin'
import { readMorePlugin } from './tw-plugins/readMorePlugin'
import { placeholderPlugin } from './tw-plugins/placeholderPlugin'
import { offCanvasPlugin } from './tw-plugins/offCanvasPlugin'
import { paginationPlugin } from './tw-plugins/paginationPlugin'

import { breadcrumbPlugin } from './tw-plugins/breadcrumbPlugin'

///////////////////////////////////////////////////////////////////////////
//
// Gotcha: Switching to a .ts extension breaks the above import annotation.
// The above annotation give us autocomplete when typing inside the config
// You can also use CONTROL + Space to manually trigger it.
// If you use a .ts extenstion, then manually implement typings as
// follows: https://flaming.codes/posts/typescript-for-tailwind-css-config
//
//   import type { Config } from 'tailwindcss'
//   const config = { ... } satisfies Config
//
//# Update: It may not be the .ts extension. I've also noticed that the
//# typings break if import statements come AFTER the annotation.
//
// Note: August 15, 2023 : I switched from require to import, so
// colors.ts would work in component files. Everything still
// seems to work fine now.
//
///////////////////////////////////////////////////////////////////////////
/** @type {import('tailwindcss').Config} */

const config = {
  // important: true,
  darkMode: 'class', // https://www.youtube.com/watch?v=oMOe_32M6ss
  // corePlugins: { preflight: false },

  //! In v4, this may no longer be necessary.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // For this demo, I switched to Bootstrap breakpoints: https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px'
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // https://tailwindcss.com/docs/customizing-colors
    // Why am I doing it in extend.colors? For some of the color names
    // it's not really necessary.
    //
    //   https://tailwindcss.com/docs/customizing-colors#adding-additional-colors
    //   If you’d like to add a brand new color to the default palette, add it in
    //   the theme.extend.colors section of your configuration file.
    //
    // Not sure, but it's also possible that not using extend will ultimately reset
    // ALL colors such, and we definitely don't want that. In other words theme.colors: {}
    // might result in NO colors except those explicitly defined.
    //
    // A good idea for extending colors would be to mod the default colors as needed, but
    // possibly also add primary, secondary, success, etc.
    //
    ///////////////////////////////////////////////////////////////////////////

    extend: {
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '1.5' }]
      },

      colors: {
        // This is a Tailwind color generator tool: https://www.tints.dev/
        // https://www.simeongriggs.dev/using-the-tailwind-css-palette-generator-and-api

        // Lighter than the default (less of a mustard color).
        yellow: {
          50: '#FFFBE5',
          100: '#FFF7CC',
          200: '#FFF099',
          300: '#FFE866',
          400: '#FFE033',
          500: '#FFD700',
          600: '#CCAD00',
          700: '#998200',
          800: '#665700',
          900: '#332B00',
          950: '#191600'
        },

        olive: {
          50: '#F9FCE4',
          100: '#F3F9CD',
          200: '#E7F39B',
          300: '#DCED68',
          400: '#D0E736',
          500: '#B5CC18',
          600: '#91A413',
          700: '#6D7B0F',
          800: '#48520A',
          900: '#242905',
          950: '#101202'
        },

        green: {
          50: '#EAFAEA',
          100: '#D6F5D6',
          200: '#ADEBAD',
          300: '#84E184',
          400: '#5BD75B',
          500: '#32CD32',
          600: '#28A428',
          700: '#1E7B1E',
          800: '#145214',
          900: '#0A290A',
          950: '#051505'
        },

        // Very bright!
        pink: {
          50: '#FFE5F3',
          100: '#FFD1EA',
          200: '#FFA3D4',
          300: '#FF70BC',
          400: '#FF42A7',
          500: '#FF1493',
          600: '#DB0075',
          700: '#A30057',
          800: '#70003C',
          900: '#38001E',
          950: '#19000E'
        },

        brown: {
          50: '#F7EEE9',
          100: '#EFE0D6',
          200: '#E0C2AE',
          300: '#D0A385',
          400: '#C1855D',
          500: '#A5673F',
          600: '#855433',
          700: '#643F26',
          800: '#422A19',
          900: '#21150D',
          950: '#0F0906'
        },

        // Lighter than the default (less blue, more stone like).
        // Doing this is actually a bad idea because it wrecks the
        // continuity of the gray scale from slate to stone.
        // gray: {
        //   50: '#F2F2F2',
        //   100: '#E3E3E3',
        //   200: '#C9C9C9',
        //   300: '#ADADAD',
        //   400: '#919191',
        //   500: '#767676',
        //   600: '#5E5E5E',
        //   700: '#474747',
        //   800: '#303030',
        //   900: '#171717',
        //   950: '#0D0D0D'
        // },
        light: 'rgb(248, 249, 250)',
        // Bootstrap uses  #212529 / rgb(33, 37, 41). However,
        // I prefer to go just a little lighter with charcoal.
        dark: '#333'
      },

      fontFamily: {
        sans: [
          ///////////////////////////////////////////////////////////////////////////
          //
          // Poppins was added. Everything else is in the sans array is the default.
          // The reason Poppins was added to sans is because sans is the default font:
          //
          //   https://tailwindcss.com/docs/font-family
          //   For convenience, Preflight sets the font family on the html element to match your
          //   configured sans font, so one way to change the default font for your project is to
          //   customize the sans key in your fontFamily configuration. See URL above for other
          //   approaches.
          //
          // The serif: [], and mono: [] are still implicitly applied.
          //
          ///////////////////////////////////////////////////////////////////////////
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ]
        // The serif and mono will stil be implied if ommitted.
        // serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        // mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      },

      ///////////////////////////////////////////////////////////////////////////
      //
      // Any change made to colors necessitates updating the associated focus-* value.
      // See here for other box-shadow ideas: https://manuarora.in/boxshadows
      //
      // Note: you could do this sort of thing:
      //
      // boxShadow: ({ theme }) => {
      //   return {
      //     'focus-green': `0 0 0 0.25rem ${theme('colors.green.500 / 50%')}`,
      //     ...
      //   }
      // }
      //
      // But there's actually an easier way. The theme() function can actually exist
      // inside of a string WITHOUT template literals:
      //
      //   'focus-green': "0 0 0 0.25rem theme('colors.green.500/50%')"
      //
      // Of course, we can still make this even better by doing programmatically.
      // In that case, we would probably need to use the function syntax instead.
      //
      ///////////////////////////////////////////////////////////////////////////
      boxShadow: {
        'focus-inherit': '',
        'focus-current': '',
        'focus-transparent': '',
        'focus-black': '0 0 0 0.25rem rgba(0, 0, 0, 0.5)',
        'focus-white': '0 0 0 0.25rem rgba(255, 255, 255, 0.5)',
        'focus-dark': "0 0 0 0.25rem theme('colors.dark/50%')",
        'focus-light': "0 0 0 0.25rem theme('colors.light/50%')",
        'focus-slate': "0 0 0 0.25rem theme('colors.slate.500/50%')",
        'focus-gray': "0 0 0 0.25rem theme('colors.gray.500/50%')",
        'focus-zinc': "0 0 0 0.25rem theme('colors.zinc.500/50%')",
        'focus-neutral': "0 0 0 0.25rem theme('colors.neutral.500/50%')",
        'focus-stone': "0 0 0 0.25rem theme('colors.stone.500/50%')",

        'focus-red': "0 0 0 0.25rem theme('colors.red.500/50%')",
        'focus-orange': "0 0 0 0.25rem theme('colors.orange.500/50%')",
        'focus-amber': "0 0 0 0.25rem theme('colors.amber.500/50%')",
        'focus-yellow': "0 0 0 0.25rem theme('colors.yellow.500/50%')",
        'focus-lime': "0 0 0 0.25rem theme('colors.lime.500/50%')",
        'focus-green': "0 0 0 0.25rem theme('colors.green.500/50%')",
        'focus-emerald': "0 0 0 0.25rem theme('colors.emerald.500/50%')",
        'focus-teal': "0 0 0 0.25rem theme('colors.teal.500/50%')",
        'focus-cyan': "0 0 0 0.25rem theme('colors.cyan.500/50%')",
        'focus-sky': "0 0 0 0.25rem theme('colors.sky.500/50%')",
        'focus-blue': "0 0 0 0.25rem theme('colors.blue.500/50%')",
        'focus-indigo': "0 0 0 0.25rem theme('colors.indigo.500/50%')",
        'focus-violet': "0 0 0 0.25rem theme('colors.violet.500/50%')",
        'focus-purple': "0 0 0 0.25rem theme('colors.purple.500/50%')",
        'focus-fuchsia': "0 0 0 0.25rem theme('colors.fuchsia.500/50%')",
        'focus-pink': "0 0 0 0.25rem theme('colors.pink.500/50%')",
        'focus-rose': "0 0 0 0.25rem theme('colors.rose.500/50%')",

        'focus-olive': "0 0 0 0.25rem theme('colors.olive.500/50%')",
        'focus-brown': "0 0 0 0.25rem theme('colors.brown.500/50%')"
      }
    }
  },

  safelist: [
    /* ======================
              bg
    ====================== */
    // 200 bg for Alert
    // 500 for Button & General

    'bg-inherit', // General
    'bg-current', // General
    'bg-transparent', // General
    'bg-black', // General
    'bg-white', // General
    'bg-dark', // Alert & General
    'bg-light', // Alert & General

    // Match any string that begins with 'bg-, anytheing except '-', then '-200'
    { pattern: /bg-.[^-]+-200/ },
    {
      pattern: /bg-.[^-]+-500/,
      // 500 hover & focus for outline Button
      variants: ['hover', 'focus']
    },

    /* ======================
              text
    ====================== */
    // 500 for outline Button & General
    // 800 for Alert

    'text-inherit', // General
    'text-current', // General
    'text-transparent', // General
    'text-black', // General
    'text-white', // General
    'text-dark', // Alert & General
    'text-light', // Alert & General

    { pattern: /text-.[^-]+-(500|800)/ },

    /* ======================
              border
    ====================== */
    // 400 for Button
    // 500 for General & oultine Button
    // 600 for Button
    // 800 for Alert

    'border-inherit', // General
    'border-current', // General
    'border-transparent', // General
    'border-black', // Alert & General
    'border-white', // General
    'border-dark', // General
    'border-light', // General

    { pattern: /border-.[^-]+-(500|800)/ },

    {
      pattern: /border-.[^-]+-400/,
      // dark for solid Button
      // 400 dark:hover & dark:focus for outline Button
      variants: ['dark', 'dark:hover', 'dark:focus']
    },

    {
      // 600 for solid Button's outline
      pattern: /border-.[^-]+-600/,
      // 600 hover & focus for outline Button
      variants: ['hover', 'focus']
    },

    /* ======================
            shadow
    ====================== */

    { pattern: /shadow-.[^-]+-800/ }, // 800 shadows for Alert

    // For Button
    {
      pattern: /shadow-focus-.[^-]+/,
      variants: ['focus']
    },

    /* ======================
            font size
    ====================== */
    // All font sizes are used in Button.

    'text-xxs',
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl'
  ],

  plugins: [
    colorVarsPlugin,
    basePlugin,
    badgePlugin,
    buttonPlugin,
    alertPlugin,
    listGroupPlugin,
    spinnerPlugin,
    tabsPlugin,
    tablePlugin,
    modalPlugin,
    tooltipPlugin,
    popoverPlugin,
    dropdownPlugin,
    scrollAreaPlugin,
    accordionPlugin,
    formPlugin,
    readMorePlugin,
    placeholderPlugin,
    offCanvasPlugin,
    paginationPlugin,
    breadcrumbPlugin
  ]
}

export default config

/* ======================
        twMerge()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/epicweb-dev/epic-stack/issues/301
// https://github.com/dcastil/tailwind-merge/blob/v1.14.0/docs/api-reference.md#extendtailwindmerge
//
// It looks like twMerge does not read your tailwind config so you have to manually
// configure it whenever you have custom classes (like 'text-xxs' or possibly also olive color, etc).
// It's not immediately clear where to find the classGroups keys, but you can view DefaultClassGroupIds here:
// https://github.com/dcastil/tailwind-merge/blob/main/src/lib/types.ts
//
// Thus far, I have not experienced any issues with custom colors (e.g., 'olive', 'brown'), or custom shadows.
// However, if that occurs, the solution would be to add them to the mapping here.
//
// Iniitially, the issue I experience was when I tried using 'text-xxs', it ended up dropping 'text-white'.
// This likely occurred becuase twMerge() got confuses because it thought 'text-white' conflicted with 'text-xxs'.
// However, in the case of color variants like 'bg-*-*', 'text-*-*', 'border-*-*', it may be less ambiguous such
// that tailwind-merge is able to discern if/when there is a conflict more accurately. That's just a guess...
//
// There's actually a lot of nuance and depth to how tailwind-merge works.
// For further reading on how it checks for conflicts see here:
//
//   - https://github.com/dcastil/tailwind-merge/discussions/278
//   - https://github.com/dcastil/tailwind-merge/blob/v1.14.0/docs/configuration.md#theme
//
///////////////////////////////////////////////////////////////////////////

export const twMerge = extendTailwindMerge({
  classGroups: {
    'font-size': Object.keys(config.theme.extend.fontSize).map(
      (key) => `text-${key}`
    )
  }
})
