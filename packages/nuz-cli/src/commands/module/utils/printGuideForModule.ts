import getCurrentNodeScript from '../../../utils/getCurrentNodeScript'
import normalizePackageName from '../../../utils/normalizePackageName'
import print, { log } from '../../../utils/print'

function printGuideForModule(name: string, useYarn: boolean): void {
  const normalizedName = normalizePackageName(name)

  log(`Successfully created ${print.name(name)} module, accessed by command:`)
  log(print.dim('$ '), print.cyan(`cd ${normalizedName}`))
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
    print.cyan(
      `cd ${normalizedName} && ${getCurrentNodeScript('dev', useYarn)}`,
    ),
  )
  log()
  log(print.dim('Happy coding!'))
  log()
}

export default printGuideForModule
