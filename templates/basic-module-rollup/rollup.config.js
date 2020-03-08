import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.jsx',
  output: {
    name: 'BasicModuleRollup',
    sourcemap: true,
    file: 'dist/index.js',
    format: 'umd',
    globals: { react: 'React' },
  },
  plugins: [
    peerDepsExternal(),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    babel({ exclude: 'node_modules/**' }),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json']
    }),
    commonjs(),
  ],
  external: ['react', 'react-dom'],
};
