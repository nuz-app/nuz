function getCurrentNodeScript(script: string, useYarn: boolean): string {
  return [useYarn ? 'yarn' : 'npm run', script].join(' ')
}

export default getCurrentNodeScript
