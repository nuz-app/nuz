const getCurrentNodeScript = (script: string, useYarn: boolean) =>
  [useYarn ? 'yarn' : 'npm run', script].join(' ')

export default getCurrentNodeScript
