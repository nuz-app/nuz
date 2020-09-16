import browserslist from 'browserslist'

interface BrowserlistOptions {
  directory: string
  dev: boolean
}

function getBrowserslist(options: BrowserlistOptions): string[] {
  const { directory, dev } = options

  let browsers = ['default']
  try {
    browsers = browserslist.loadConfig({
      path: directory,
      env: dev ? 'development' : 'production',
    })
  } catch {
    //
  }

  return browsers
}

export default getBrowserslist
