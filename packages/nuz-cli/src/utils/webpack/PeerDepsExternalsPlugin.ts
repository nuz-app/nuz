import { getPackageJsonInDir } from '@nuz/utils'

import setExternals from './helpers/setExternals'

// tslint:disable-next-line: no-var-requires
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin')

function getPeerDependencies(dir: string | undefined, isolated: boolean) {
  try {
    const moduleDir = dir || process.cwd()
    const pkgJson = getPackageJsonInDir(moduleDir)

    return Object.keys(pkgJson.peerDependencies).reduce(
      (acc, key) => Object.assign(acc, { [key]: setExternals(key, isolated) }),
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
  ) {}

  apply(compiler: any) {
    const peerDependencies = getPeerDependencies(this.dir, this.isolated)

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
