function showHelpIfInvalid(
  yargs,
  argv,
  minRequired: number,
  maxRequired: number = -1,
) {
  const length = argv._.length
  if (length < minRequired && (maxRequired === -1 || length <= maxRequired)) {
    yargs.showHelp()
  }
}

export default showHelpIfInvalid
