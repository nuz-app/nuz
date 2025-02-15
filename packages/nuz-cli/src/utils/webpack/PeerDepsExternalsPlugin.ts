import readPackageJson from '../readPackageJson'

import setExternals from './setExternals'

// tslint:disable-next-line: no-var-requires
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin')

function getPeerDependencies(
  directory: string | undefined,
  isolated: boolean,
  exclude: string[] = [],
) {
  try {
    const resolveModuleDirectory = directory || process.cwd()
    const packageJson = readPackageJson(resolveModuleDirectory)

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
    private readonly directory: string | undefined,
    private readonly isolated: boolean,
    private readonly exclude: string[] = [],
  ) {}

  apply(compiler: any) {
    const peerDependencies = getPeerDependencies(
      this.directory,
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
