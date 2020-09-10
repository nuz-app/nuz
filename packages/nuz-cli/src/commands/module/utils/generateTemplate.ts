import glob from 'glob'
import path from 'path'

import * as paths from '../../../paths'
import createQuestions from '../../../utils/createQuestions'
import * as fs from '../../../utils/fs'
import print from '../../../utils/print'

const CONFIG_FILE = `
// Main fields load from './package.json'
// Such as: name, version, library, source -> input, main -> output.

module.exports = ({content})
`

const mapStyleToDependencies = {
  none: {},
  css: {},
  sass: { 'node-sass': '^4.13.0' },
  less: { less: '^3.11.0' },
}

const getQuestions = (name: string) => [
  {
    type: 'list',
    name: 'language',
    default: 'Javascirpt',
    message: `Which ${print.bold('language')} using for ${print.name(
      name,
    )} module?`,
    choices: ['javascript', 'typescript'],
  },
  {
    type: 'list',
    name: 'style',
    default: 'css',
    message: `Which ${print.bold('stylesheet language')} using for ${print.name(
      name,
    )} module?`,
    choices: ['none', 'css', 'sass', 'less'],
  },
]

const generateTemplate = async (
  dir: string,
  {
    name,
    version,
    library,
  }: { name: string; version: string; library?: string },
) => {
  const result = await createQuestions<{ language: string; style: string }>(
    getQuestions(name),
  )
  const useTypescript = result.language === 'typescript'
  const scriptExtension = useTypescript ? 'tsx' : 'jsx'

  // Clone default module to dir
  const defaultModule = path.join(paths.tool + '/templates/module')
  await fs.copy(defaultModule, dir)

  const inputPath = `src/index.${scriptExtension}`
  const outputPath = `dist/index.js`

  // Copy copy based on style from example folder
  const usedComponentPath = path.join(dir, `src/examples/Hello-${result.style}`)
  const distComponentPath = path.join(dir, 'src/components/Hello')
  await fs.copy(usedComponentPath, distComponentPath)

  // Clean example folder
  const examplePath = path.join(dir, 'src/examples')
  await fs.remove(examplePath)

  // Write `package.json` file for module
  const packageJsonPath = path.join(dir, 'package.json')
  const packageJson = Object.assign({ name, version }, library && { library }, {
    source: inputPath,
    main: outputPath,
    scripts: {
      dev: 'nuz dev --port 4000',
      build: 'nuz build',
      serve: 'nuz serve --port 4000',
    },
    dependencies: {},
    devDependencies: Object.assign(
      {
        '@nuz/cli': 'latest',
        '@nuz/core': 'latest',
      },
      useTypescript && {
        '@types/node': '^12.12.21',
        '@types/react': '^16.9.16',
        '@types/react-dom': '^16.9.4',
        typescript: '^3.8.3',
      },
      mapStyleToDependencies[result.style] || {},
      {
        react: '^16.12.0',
        'react-dom': '^16.12.0',
      },
    ),
    peerDependencies: {
      '@nuz/core': '*',
      react: '*',
      'react-dom': '*',
    },
  })
  fs.writeJson(packageJsonPath, packageJson)

  // Write `nuz.config.js` config file for module
  const moduleConfig = {
    feature: true,
    publicPath: '/',
  }
  const dataConfig = CONFIG_FILE.replace(
    '{content}',
    JSON.stringify(moduleConfig, null, 2),
  )
  const configPath = path.join(dir, 'nuz.config.js')
  fs.writeSync(configPath, dataConfig)

  // Update `README.md` file
  const readmePath = path.join(dir, 'README.md')
  fs.writeSync(
    readmePath,
    fs.read(readmePath).toString('utf8').replace('{module-name}', name),
  )

  if (!useTypescript) {
    // Remove `tsconfig.json` file if not using Typescript
    const tsconfigPath = path.join(dir, 'tsconfig.json')
    await fs.remove(tsconfigPath)

    // Rename extension files
    const matches = glob.sync(dir + '/src/**/*.tsx')
    const promise = matches.map((match) =>
      fs.move(match, match.replace('.tsx', `.${scriptExtension}`)),
    )
    await Promise.all(promise)
  }

  // Remove unused `index` script file
  const pubicIndexPath = path.join(
    dir,
    'public',
    useTypescript ? 'index.js' : 'index.ts',
  )
  await fs.remove(pubicIndexPath)

  // Remove styles types if not used
  const typePath = path.join(dir, 'nuz-env.d.ts')
  if (!useTypescript || result.style === 'none') {
    await fs.remove(typePath)
  }

  return true
}

export default generateTemplate
