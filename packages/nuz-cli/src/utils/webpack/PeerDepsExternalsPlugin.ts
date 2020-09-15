import { getPackageJsonInDirectory } from '@nuz/utils'

import setExternals from './helpers/setExternals'

// tslint:disable-next-line: no-var-requires
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin')

function getPeerDependencies(
  dir: string | undefined,
  isolated: boolean,
  exclude: string[] = [],
) {
  try {
    const moduleDir = dir || process.cwd()
    const packageJson = getPackageJsonInDirectory(moduleDir)

    return Object.keys(packageJson.peerDependencies).reduce(
      (acc, key) =>
        exclude.includes(key)
          ? acc
          : Object.assign(acc, { [key]: setExternals(key, isolated) }),
      {},
    )
  } catch (err) {
    return []
  }
}

class PeerDepsExternalsPlugin {
  constructor(
    private readonly dir: string | undefined,
    private readonly isolated: boolean,
    private readonly exclude: string[] = [],
  ) {}

  apply(compiler: any) {
    const peerDependencies = getPeerDependencies(
      this.dir,
      this.isolated,
      this.exclude,
    )

    // webpack 4+
    if (compiler.hooks) {
      compiler.hooks.compile.tap('compile', (params: any) => {
        new ExternalModuleFactoryPlugin(
          compiler.options.output.libraryTarget,
          peerDependencies,
        ).apply(params.normalModuleFactory)
      })
      // webpack < 4, remove this in next major version
    } else {
      compiler.plugin('compile', (params: any) => {
        params.normalModuleFactory.apply(
          new ExternalModuleFactoryPlugin(
            compiler.options.output.libraryTarget,
            peerDependencies,
          ),
        )
      })
    }
  }
}

export default PeerDepsExternalsPlugin
