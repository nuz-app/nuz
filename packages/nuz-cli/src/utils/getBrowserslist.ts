import browserslist from 'browserslist'

const getBrowserslist = ({ dir, dev }: { dir: string; dev: boolean }) => {
  let browsers = ['default']
  try {
    browsers = browserslist.loadConfig({
      path: dir,
      env: dev ? 'development' : 'production',
    })
  } catch {
    //
  }

  return browsers
}

export default getBrowserslist
