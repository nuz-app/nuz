export const exit = (code?: number) => process.exit(code)

export const onExit = (fn: NodeJS.ExitListener) => {
  process.on('exit', fn)
}

process.on('SIGINT', () => exit(2))
