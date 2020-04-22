function showHelpIfInvalid(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp()
  }
}

export default showHelpIfInvalid
