import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

import * as paths from '../../../paths'
import createQuestions from '../../../utils/createQuestions'
import print from '../../../utils/print'

const CONFIGURATION_TEMPLATE = `
// Main fields load from './package.json'
// Such as: name, version, library, source -> input, main -> output.

module.exports = ({content})
`

const stylingMap = {
  none: {},
  css: {},
  sass: { 'node-sass': '^4.13.0' },
  less: { less: '^3.11.0' },
}

interface GenerateTemplateConfig {
  name: string
  version: string
  library?: string
}

async function generateTemplate(
  directory: string,
  config: GenerateTemplateConfig,
): Promise<boolean> {
  const { name, version, library } = config

  //
  const answers = await createQuestions<{ language: string; style: string }>([
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
      message: `Which ${print.bold(
        'stylesheet language',
      )} using for ${print.name(name)} module?`,
      choices: ['none', 'css', 'sass', 'less'],
    },
  ])

  //
  const useTypescript = answers.language === 'typescript'
  const scriptExtension = useTypescript ? 'tsx' : 'jsx'

  //
  const resolveInputFile = `src/index.${scriptExtension}`
  const resolveOutputFile = `dist/index.js`

  //
  await fs.copy(paths.resolveTemplates('module'), directory)

  //
  await fs.copy(
    path.join(directory, `src/examples/Hello-${answers.style}`),
    path.join(directory, 'src/components/Hello'),
  )

  //
  await fs.remove(path.join(directory, 'src/examples'))

  //
  const resolvePackageJson = paths.resolvePackageJson(directory)
  await fs.writeFile(
    resolvePackageJson,
    JSON.stringify(
      Object.assign({ name, version }, library && { library }, {
        source: resolveInputFile,
        main: resolveOutputFile,
        scripts: {
          dev: 'nuz dev',
          build: 'nuz build',
          serve: 'nuz serve',
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
          stylingMap[answers.style] || {},
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
      }),
      null,
      2,
    ),
  )

  //
  const resolveReadmeFile = paths.resolveReadmeFile(directory)
  const updatedReadmeFile = await fs
    .readFileSync(resolveReadmeFile, {
      encoding: 'utf8',
    })
    .replace('{module-name}', name)
  await fs.writeFile(resolveReadmeFile, updatedReadmeFile)

  //
  if (!useTypescript) {
    const tsconfigPath = path.join(directory, 'tsconfig.json')
    await fs.remove(tsconfigPath)
  }

  //
  if (!useTypescript || answers.style === 'none') {
    await fs.remove(paths.resolveGlobalTypesFile(directory))
  }

  //
  const filesWillBeRemoved = glob.sync(
    '{src,public}/**/*.' + useTypescript ? '{js,jsx}' : '{ts,tsx}',
    {
      cwd: directory,
    },
  )
  await Promise.all((filesWillBeRemoved || []).map((file) => fs.remove(file)))

  //
  await fs.writeFile(
    paths.resolveInternalConfig(directory, true) as string,
    CONFIGURATION_TEMPLATE.replace(
      '{content}',
      JSON.stringify(
        {
          feature: true,
          publicPath: '/',
        },
        null,
        2,
      ),
    ),
  )

  return true
}

export default generateTemplate
