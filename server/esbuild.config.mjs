import * as esbuild from 'esbuild'
import copyStaticFiles from 'esbuild-copy-static-files'
// import fs from 'fs'
// import path from 'path'

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  bundle: true,
  platform: 'node',
  minify: false, // Optional for production builds
  // format: 'esm',
  // Defines global variables to be available during the build process (optional).
  // define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  sourcemap: true,
  // watch: false, // Optional for development
  plugins: [
    copyStaticFiles({
      src: './src/public',
      dest: './dist/public',
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true
      // filter: (file) => {
      //   return (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.jpg') || file.endsWith('.png'))
      // }
    })

    // Or create a custom plugin to copy files over.
    // {
    //   name: 'custom-plugin',
    //   setup(build) {
    //     build.
    //     build.onEnd(async (_result) => {
    //       // Access build results here
    //       // const outputFiles = result.outputFiles
    //       // console.log('Build completed! Output files:', outputFiles);
    //       // Perform post-build actions:
    //       // const cpy = (await import('cpy')).default
    //       // await cpy(
    //       //   [
    //       //     // 'src/**/*.html', // Copy all .html files
    //       //     // 'src/**/*.css', // Copy all .css files
    //       //     'src/**',
    //       //     '!src/**/*.{tsx,ts,js,jsx}' // Ignore already built files
    //       //   ],
    //       //   'dist'
    //       // )
    //     })
    //   }
    // }

    // {
    //   name: 'fix-cloudinary',
    //   setup(build) {
    //     build.onLoad(
    //       {
    //         filter:
    //           /node_modules\/cloudinary\/lib\/utils\/analytics\/getSDKVersions\.js$/
    //       },
    //       async (args) => {
    //         let contents = await fs.promises.readFile(args.path, 'utf8')

    //         ///////////////////////////////////////////////////////////////////////////
    //         //
    //         // Originally I merely replaced this line:
    //         //
    //         //   contents = contents.replace(
    //         //     /const pkgJSONFile = fs\.readFileSync\(path\.join\(__dirname, '\.\.\/\.\.\/\.\.\/package\.json'\), 'utf-8'\);/,
    //         //     `const pkgJSONFile = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8");`
    //         //   )
    //         //
    //         // However, that still makes it dependent on the package.json, which sits outside of
    //         // the dist/. A better approach is to simply pass the package.json version directly from
    //         // here as a interpolated value:
    //         //
    //         ///////////////////////////////////////////////////////////////////////////

    //         const pkgJSONFile = fs.readFileSync(
    //           path.join(process.cwd(), 'package.json'),
    //           'utf-8'
    //         )

    //         const version = JSON.parse(pkgJSONFile).version
    //         // console.log({ type: typeof version, version }) // => { type: 'string', version: '0.0.1' }

    //         contents = contents.replace(
    //           /const pkgJSONFile = fs\.readFileSync\(path\.join\(__dirname, '\.\.\/\.\.\/\.\.\/package\.json'\), 'utf-8'\);/,
    //           ''
    //         )

    //         // It's important that we look for 'default' with single quotes here.
    //         contents = contents.replace(
    //           /const sdkSemver = useSDKVersion === 'default' \? JSON\.parse\(pkgJSONFile\)\.version : useSDKVersion;/,
    //           `const sdkSemver = useSDKVersion === 'default' ? '${version}' : useSDKVersion;`
    //         )

    //         // console.log('After Contents:', contents)
    //         return {
    //           contents,
    //           loader: 'default'
    //         }
    //       }
    //     )
    //   }
    // }
  ]
})
