export const exit = (code?: number) => process.exit(code)

export const onExit = fn => {
  process.on('exit', fn)
}

process.on('SIGINT', () => exit(2))
