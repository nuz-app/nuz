import getCurrentNodeScript from '../../utils/getCurrentNodeScript'
import print, { error, info, log, success } from '../../utils/print'

export const notifyOnStart = (name: string, dir: string) => {
  log()
  info(`Creating a new ${print.name(name)} module in ${print.link(dir)}.`)
  log()
}

export const networkNotAvailable = () => {
  error(`The connection is not available, please try again later!`)
}

export const templateIsNotFound = (template: string) => {
  error(`Not found ${print.blue(template)} template in Github.`)
}

export const templateIsDownloading = (name: string, template: string) => {
  info(
    `Downloading template ${print.blue(template)} for ${print.cyan(
      name,
    )} module. This might take a moment.`,
  )
  log()
}

export const templateCloning = (name: string, template: string) => {
  info(
    `Cloning template ${print.blue(template)} for ${print.cyan(name)} module.`,
  )
  log()
}

export const filesIsPreparing = () => {
  info(`Preparing some files important for module.`)
  log()
}

export const packagesInstalling = (tool: string) => {
  info(
    `Installing packages by ${print.blue(
      tool,
    )}. This might take a couple of minutes.`,
  )
  log()
}

export const packagesInstalled = () => {
  info(`Installed packages for module.`)
  log()
}

export const questionsToMakeConfig = (name: string) => {
  log(`Answer below questions to generate ${print.cyan(name)} module.`)
  log()
}

export const guide = (name: string, useYarn: boolean) => {
  success('Inside that directory, you can run several commands:')
  log()
  log(
    `Starts the development server:`,
    print.cyan(getCurrentNodeScript('dev', useYarn)),
  )
  log()
  log(
    `Builds the app for production:`,
    print.cyan(getCurrentNodeScript('build', useYarn)),
  )
  log()
  log(
    `File serving and directory listing:`,
    print.cyan(getCurrentNodeScript('serve', useYarn)),
  )
  log()
  log(
    'We suggest that you begin by typing:',
    print.cyan(`cd ${name} && ${getCurrentNodeScript('dev', useYarn)}`),
  )
  log()
}
