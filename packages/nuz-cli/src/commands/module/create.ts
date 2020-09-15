import { deferedPromise } from '@nuz/utils'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import ProgressBar from 'progress'
import { Arguments } from 'yargs'

import * as paths from '../../paths'
import checkIsOnline from '../../utils/checkIsOnline'
import checkIsTemplateExisted from '../../utils/checkIsTemplateExisted'
import checkIsYarnInstalled from '../../utils/checkIsYarnInstalled'
import createQuestions from '../../utils/createQuestions'
import * as dependenciesHelpers from '../../utils/dependenciesHelpers'
import downloadAndExtractTemplate from '../../utils/downloadAndExtractTemplate'
import * as gitHelpers from '../../utils/gitHelpers'
import normalizePackageName from '../../utils/normalizePackageName'
import print, { info, log, warn } from '../../utils/print'

import ensureImportantsFiles from './utils/ensureImportantsFiles'
import generateTemplate from './utils/generateTemplate'
import printGuideForModule from './utils/printGuideForModule'
import updatePackageJson from './utils/updatePackageJson'

const INITIAL_COMMIT_MESSAGE = 'Initialized by `@nuz/cli`'

interface ModuelCreateOptions
  extends Arguments<{ name?: string; template?: string }> {}

async function create(options: ModuelCreateOptions): Promise<any> {
  const { name: _name, template: _template } = options
  //
  const answers = Object.assign(
    { name: _name, template: _template },
    await createQuestions(
      [
        !_name && {
          type: 'string',
          name: 'name',
          message: `What is your module named?`,
          validate: (value: string) => !!value,
        },
        {
          type: 'string',
          name: 'version',
          message: `Starting version?`,
          default: '0.1.0',
        },
        !_template && {
          type: 'string',
          name: 'template',
          message: `What template you want to use?`,
          default: false,
        },
      ].filter(Boolean) as inquirer.Answers[],
    ),
  ) as {
    name: string
    version: string
    template: string
  }
  if (!answers || !answers.name || !answers.version) {
    throw new Error(
      'Please fill in enough information to be able to create new module',
    )
  }

  const currentWorkingDirectory = paths.cwd
  const name = answers.name as any
  const normalizedName = normalizePackageName(name)
  const directory = path.join(currentWorkingDirectory, normalizedName)
  const isOnline = await checkIsOnline()

  info(
    `Start creating new ${print.name(
      answers.name,
    )} module, version ${print.blue(answers.version)}!`,
  )
  log()

  //
  const directoryIsExisted = fs.existsSync(directory)
  if (directoryIsExisted) {
    const { isOverried } = await createQuestions<{ isOverried: boolean }>([
      {
        type: 'confirm',
        name: 'isOverried',
        default: true,
        message: `Directory already exists, do you want to override it at ${print.link(
          directory,
        )} ?`,
      },
    ])

    //
    if (!isOverried) {
      return
    }
  }

  //
  if (directoryIsExisted) {
    info(
      `Cleaning the directory before initialization at ${print.link(
        directory,
      )}...`,
    )
    log()

    //
    await fs.emptyDir(directory)
  } else {
    info(`Creating new directory at ${print.link(directory)}...`)
    log()

    //
    await fs.ensureDir(directory)
  }

  const { template } = answers

  const isUseTemplate = !!template
  if (isUseTemplate) {
    const resolveExampleDirectory = paths.resolveExamples(template)

    if (fs.existsSync(resolveExampleDirectory)) {
      info(
        `Find the existing ${print.name(answers.template)} template locally...`,
      )
      info(
        `Starting to clone the ${print.name(
          answers.template,
        )} template to create ${print.name(answers.name)} module...`,
      )
      log()

      //
      await fs.copy(resolveExampleDirectory, directory, {
        dereference: true,
        recursive: true,
      })
    } else {
      //
      if (!isOnline) {
        throw new Error(
          'The example could not be found on Github because the desktop is currently offline.',
        )
      }

      //
      const templateIsExisted = await checkIsTemplateExisted(template)
      if (!templateIsExisted) {
        throw new Error(
          `Cannot find ${print.name(template)} template on Github`,
        )
      }

      info(
        `Downloading ${print.name(
          template,
        )} template, this might take a moment...`,
      )
      log()

      //
      const downloadDefered = deferedPromise<boolean>()
      await Promise.all([
        downloadAndExtractTemplate(directory, template, (response) => {
          const totalLength = response.headers['content-length']

          const progressBar = new ProgressBar(
            `${print.dim('[>] [:bar] :percent :etas')}`,
            {
              width: 40,
              complete: '=',
              incomplete: ' ',
              renderThrottle: 1,
              total: parseInt(totalLength, 10),
            },
          )

          response.data.on('data', (chunk) => progressBar.tick(chunk.length))
          response.data.on('end', () => downloadDefered.resolve(true))
        }),
        downloadDefered.promise,
      ])

      info(
        `Use the downloaded ${print.name(
          template,
        )} template to create ${print.name(answers.name)} module.`,
      )
      log()
    }
  }

  if (!isUseTemplate) {
    info(
      `Answer below questions to generate new template for ${print.name(
        name,
      )} module.`,
    )
    log()

    //
    await generateTemplate(directory, answers)
  }

  info(`Preparing important files for new module...`)
  log()

  //
  await ensureImportantsFiles(directory, ['.gitignore', 'package.json'])

  //
  await updatePackageJson(directory, answers)

  //
  const useYarn = checkIsYarnInstalled()

  info(
    `Installing packages by ${print.blue(
      useYarn ? 'Yarn' : 'NPM',
    )}, this might take a couple of minutes...`,
  )
  log()

  //
  if (isOnline) {
    const installed = await dependenciesHelpers.install(directory, { useYarn })
    if (installed.failed) {
      warn(
        'There was an error in the dependencies installation process, try again before starting.',
      )
      log()
    }
  } else {
    warn(
      `Skip installing dependencies because you\'re not connected to the internet try again before starting.`,
    )
    log()
  }

  const isGitInitialized = gitHelpers.initialize(
    directory,
    INITIAL_COMMIT_MESSAGE,
  )
  if (!isGitInitialized) {
    warn(
      `Git has not been initialized, it is possible that the module is in workspaces.`,
    )
    log()
  }

  info(`Successfully installed dependencies for the module`)
  log()

  //
  printGuideForModule(name, useYarn)

  return true
}

export default create
