import glob from 'glob'
import path from 'path'

import createQuestions from '../../utils/createQuestions'
import * as fs from '../../utils/fs'
import * as paths from '../../utils/paths'
import print from '../../utils/print'

const CONFIG_FILE = `
// Main fields load from './package.json'
// Such as: name, version, library, source -> input, main -> output.

module.exports = ({content})
`

const getQuestions = (name: string) => [
  {
    type: 'list',
    name: 'language',
    default: 'Javascirpt',
    message: `Which ${print.bold('languages')} using for ${print.name(
      name,
    )} module?`,
    choices: ['javascript', 'typescript'],
  },
  {
    type: 'list',
    name: 'style',
    default: 'Css',
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
  }: { name: string; version: string; library: string },
) => {
  const questions = getQuestions(name)
  const results = await createQuestions<{ language: string; style: string }>(
    questions,
  )
  const useTypescript = results.language === 'typescript'
  const scriptExtension = useTypescript ? 'tsx' : 'jsx'

  // Clone default module to dir
  const defaultModule = path.join(paths.tool + '/templates/default')
  await fs.copy(defaultModule, dir)

  const inputPath = `src/index.${scriptExtension}`
  const outputPath = `dist/index.js`

  // Copy copy based on style from example folder
  const usedComponentPath = path.join(
    dir,
    `src/examples/Hello-${results.style}`,
  )
  const distComponentPath = path.join(dir, 'src/components/Hello')
  await fs.copy(usedComponentPath, distComponentPath)

  // Clean example folder
  const examplePath = path.join(dir, 'src/examples')
  await fs.remove(examplePath)

  // Write `package.json` file for module
  const packageJsonPath = path.join(dir, 'package.json')
  const packageJson = {
    name,
    version,
    library,
    source: inputPath,
    main: outputPath,
    scripts: {
      dev: 'nuz dev --port 4001',
      build: 'nuz build',
      serve: 'nuz serve --port 4001',
    },
    dependencies: {},
    devDependencies: Object.assign(
      {
        '@nuz/cli': 'latest',
      },
      useTypescript && {
        '@types/node': 'latest',
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
        typescript: '^3.8.3',
      },
      {
        react: 'latest',
        'react-dom': 'latest',
      },
    ),
    peerDependencies: {
      '@nuz/core': 'latest',
    },
  }
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

  // Remove styles types if not used
  const typePath = path.join(dir, 'src/typings.d.ts')
  if (!useTypescript || results.style === 'none') {
    await fs.remove(typePath)
  } else if (useTypescript && results.style !== 'none') {
    fs.writeSync(
      typePath,
      fs
        .read(typePath)
        .toString('utf8')
        .replace('{ext}', results.style === 'sass' ? 'scss' : results.style),
    )
  }

  return true
}

export default generateTemplate
