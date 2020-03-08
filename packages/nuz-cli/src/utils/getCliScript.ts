const getCliScript = (script: string, useYarn: boolean) =>
  [useYarn ? 'yarn' : 'npm run', script].join(' ')

export default getCliScript
