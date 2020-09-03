// @ts-check
import factory from '../../rollup.factory'

import pkg from './package.json'

const dir = __dirname
const target = 'node'

export default Object.assign(factory({ dir, target, pkg }), {
  output: [
    {
      file: pkg.main,
      sourcemap: true,
      format: 'cjs',
    },
    {
      file: pkg.module,
      sourcemap: true,
      format: 'esm',
    },
  ],
  onwarn: (msg, warn) => {
    if (!/Circular/.test(msg)) {
      warn(msg)
    }
  },
})
