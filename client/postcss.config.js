export default {
  plugins: {
    // https://tailwindcss.com/docs/using-with-preprocessors
    // 'postcss-import': {},

    ///////////////////////////////////////////////////////////////////////////
    //
    // Want to use CSS nesting without a .scss file? Just do this:  'tailwindcss/nesting': {},
    // https://tailwindcss.com/docs/using-with-preprocessors#nesting
    //
    //   .nesting-test {
    //     div {
    //       background-color: green;
    //       height: 100px;
    //       width: 100px;
    //       border-radius: 10px;
    //     }
    //     &:hover {
    //       div { background-color: blue; }
    //     }
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {}
  }
}
