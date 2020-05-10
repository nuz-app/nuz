import inquirer from 'inquirer'
import { Arguments } from 'yargs'

import checkIsOnline from '../../utils/checkIsOnline'
import checkIsTemplateExisted from '../../utils/checkIsTemplateExisted'
import checkIsYarnInstalled from '../../utils/checkIsYarnInstalled'
import createQuestions from '../../utils/createQuestions'
import downloadAndExtractTemplate from '../../utils/downloadAndExtractTemplate'
import * as fs from '../../utils/fs'
import getCurrentNodeScript from '../../utils/getCurrentNodeScript'
import * as gitHelpers from '../../utils/gitHelpers'
import installPackages from '../../utils/installPackages'
import * as localTemplatesHelpers from '../../utils/localTemplatesHelpers'
import * as paths from '../../utils/paths'
import print, { info, log, success } from '../../utils/print'

import cloneFilesIfNotFound from './utils/cloneFilesIfNotFound'
import generateTemplate from './utils/generateTemplate'
import updatePackageJson from './utils/updatePackageJson'

const getNameQuestion = () => ({
  type: 'string',
  name: 'name',
  message: `What is your module named?`,
  validate: (value: string) => !!value,
})

const getVersionQuestion = () => ({
  type: 'string',
  name: 'version',
  message: `Starting version?`,
  default: '0.1.0',
})

const getTemplateQuestion = () => ({
  type: 'string',
  name: 'template',
  message: `What template you want to use?`,
  default: false,
})

const getOverrideDirectoryQuestion = (dir: string) => ({
  type: 'confirm',
  name: 'isOverried',
  default: true,
  message: `Directory already exists, do you want to override it at ${print.link(
    dir,
  )}?`,
})

const printGuideForModule = (name: string, useYarn: boolean) => {
  log(`Successfully created ${print.name(name)} module, accessed by command:`)
  log(print.dim('$ '), print.cyan(`cd ${name}`))
  log()
  log('Inside that directory, you can run several commands')
  log()
  log(print.dim(`Starts the development server:`))
  log(print.dim('$ '), print.cyan(getCurrentNodeScript('dev', useYarn)))
  log()
  log(print.dim(`Builds the app for production:`))
  log(print.dim('$ '), print.cyan(getCurrentNodeScript('build', useYarn)))
  log()
  log(print.dim(`File serving and directory listing:`))
  log(print.dim('$ '), print.cyan(getCurrentNodeScript('serve', useYarn)))
  log()
  log(print.dim('We suggest that you begin by typing:'))
  log(
    print.dim('$ '),
    print.cyan(`cd ${name} && ${getCurrentNodeScript('dev', useYarn)}`),
  )
  log()
  log(print.dim('Happy coding!'))
  log()
}

async function create({
  name,
  template,
}: Arguments<{ name?: string; template?: string }>) {
  const cwd = paths.cwd

  const isOnline = await checkIsOnline()
  if (!isOnline) {
    throw new Error('Network unavailable, try it later!')
  }

  const restQuestions = [
    !name && getNameQuestion(),
    getVersionQuestion(),
    !template && getTemplateQuestion(),
  ].filter(Boolean) as inquirer.Answers[]
  const result = Object.assign(
    { name, template },
    await createQuestions(restQuestions),
  ) as {
    name: string
    version: string
    template: string
  }

  if (!result || !result.name || !result.version) {
    throw new Error(
      'Please fill in enough information to be able to create the module',
    )
  }

  info(
    `Start creating new ${print.name(result.name)} module, version ${print.blue(
      result.version,
    )}!`,
  )

  const dir = paths.newAppInDir(cwd, result.name)
  const dirIsExisted = fs.exists(dir)
  if (dirIsExisted) {
    const { isOverried } = await createQuestions<{ isOverried: boolean }>([
      getOverrideDirectoryQuestion(dir),
    ])
    if (!isOverried) {
      return
    }

    info(`Emptying current directory at ${print.link(dir)}`)
    await fs.emptyDir(dir)
  } else {
    info(`Creating new directory at ${print.link(dir)}`)
    await fs.create(dir)
  }

  const isUseTemplate = !!result.template
  if (isUseTemplate) {
    const templateIsExistedInLocal = localTemplatesHelpers.exists(
      result.template,
    )
    if (templateIsExistedInLocal) {
      info(`Find the existing ${print.name(result.template)} template locally`)

      info(
        `Starting to clone the ${print.name(
          result.template,
        )} template to create ${print.name(result.name)} module`,
      )
      await localTemplatesHelpers.clone(result.template, dir)
    }

    if (!templateIsExistedInLocal) {
      const templateIsExistedOnRemote = await checkIsTemplateExisted(
        result.template,
      )
      if (!templateIsExistedOnRemote) {
        throw new Error(
          `Cannot find ${print.name(result.template)} template on Github`,
        )
      }

      info(
        `Downloading ${print.name(
          result.template,
        )} template, this might take a moment`,
      )
      await downloadAndExtractTemplate(dir, result.template)
      info(
        `Use the downloaded ${print.name(
          result.template,
        )} template to create ${print.name(result.name)} module`,
      )
    }
  }

  if (!isUseTemplate) {
    info(
      `Answer below questions to generate new template for ${print.name(
        name,
      )} module`,
    )
    await generateTemplate(dir, result)
  }

  info(`Preparing important files for new module`)
  await cloneFilesIfNotFound(dir, ['.gitignore', 'package.json'])
  await updatePackageJson(dir, result)

  const useYarn = checkIsYarnInstalled()
  const nameManagerTool = useYarn ? 'Yarn' : 'Npm'
  info(
    `Installing packages by ${print.blue(
      nameManagerTool,
    )}, this might take a couple of minutes`,
  )

  const installed = await installPackages(dir, { useYarn })
  if (installed.failed) {
    throw new Error('An error occurred while installing dependencies')
  } else {
    info(`Successfully installed dependencies for the module`)
  }

  gitHelpers.initGitInDir(dir)
  printGuideForModule(result.name, useYarn)

  return true
}

export default create
