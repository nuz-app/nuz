import typescript from 'typescript'

import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import sourceMaps from 'rollup-plugin-sourcemaps'
import ts from 'rollup-plugin-typescript2'

export default ({
  dir,
  pkg,
  target,
}) => ({
  input: pkg.source,
  cache: true,
  watch: {
    include: 'src/**',
  },
  external: Object.keys(
    Object.assign(
      {}, 
      pkg.dependencies, 
      pkg.peerDependencies, 
      pkg.optionalDependencies,
      ),
    ),
  plugins: [
    // Allow json resolution
    json(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      rootDir: dir,
      preferBuiltins: true,
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json', '.node'],
      mainFields: ['module', 'jsnext', 'main'],
      resolveOnly: ['tslib'],
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      extensions: ['.mjs', '.js'],
    }),
    // Replace global variables
    replace({
      __VERSION__: JSON.stringify(pkg.version),
    }),
    // Compile TypeScript files
    ts({
      typescript,
      exclude: ['node_modules/**'],
    }),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
})
