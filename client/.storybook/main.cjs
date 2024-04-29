module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
    // Gotcha: Initially, I did this, which could be okay.
    // However, if/when we add in the example app, it breaks storybook.
    // '../**/*.stories.@(js|jsx|ts|tsx)',
    // '../**/story.@(js|jsx|ts|tsx)'

    ///////////////////////////////////////////////////////////////////////////
    //
    // Gotcha: this is no longer working: " Unable to index files..."
    //
    //   '../src/**/story.@(js|jsx|ts|tsx)'
    //
    // For some dumb reason this is related to storyStoreV7: true below.
    // TL;DR do storyStoreV7: false,
    //
    // https://github.com/storybookjs/storybook/issues/21414
    // In August of 2023 yannbf gave a detailed explanation of why it's important
    // to now name your files *.stories.*
    //
    // Long story short, it's probably a bad idea to set storyStoreV7: false
    // People are defiitely annoyed, and also note that Storybook is notoriously
    // buggy when it comes to installation. In any case, just name the stories
    // according to the convention.
    //
    ///////////////////////////////////////////////////////////////////////////
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  features: {
    storyStoreV7: true
  },
  docs: {
    autodocs: true
  }
}

/* 

In Storybook v6 implementations that used webpack, if I wanted
to give it Sass support I ahad to do something like this.
However, for Vite + Storybook 7 For Vite, Webpack is now out of the picture:

  https://storybook.js.org/blog/storybook-7-0/

Not sure how Sass would work just yet...


core: {
    builder: '@storybook/builder-webpack5'
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(c?js)$/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false }
    })

    ///////////////////////////////////////////////////////////////////////////
    //
    // I'm using the storybook webpack5 build and the most recent version of the loaders.
    //
    //   "css-loader": "^6.7.3",
    //   "sass-loader": "^13.2.0",
    //   "style-loader": "^3.3.1"
    //
    // https://storybook.js.org/docs/react/builders/webpack
    // When configuring sass, DO NOT use the use a plugin/preset.
    // They are almost all super old. Instead just do this.
    //
    ///////////////////////////////////////////////////////////////////////////

    // .scss + postcss-loader for tailwind
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',

        {
          loader: 'css-loader',
          options: {
            // https://github.com/storybookjs/storybook/issues/17095
            // This part is important: We always need to apply postcss-loader before css-loader
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader', // required for tailwind
          options: { implementation: require.resolve('postcss') }
        },

        'sass-loader'
      ],

      include: path.resolve(__dirname, '../')
    })

    // .css + postcss-loader for tailwind
    config.module.rules.push({
      test: /\.css$/i,
      use: [
        {
          loader: 'postcss-loader',
          options: { implementation: require.resolve('postcss') }
        }
      ],
      include: path.resolve(__dirname, '../')
    })

    return config
  }
*/
