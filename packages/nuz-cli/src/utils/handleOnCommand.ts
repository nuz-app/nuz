import { error } from './print'
import { exit } from './process'

const handleOnCommand = (fn: (...rest: any[]) => Promise<any>) => async (
  ...rest
) => {
  try {
    const shouldClose = await fn(...rest)
    if (shouldClose) {
      return exit(0)
    }
  } catch (err) {
    error(err)
    return exit(1)
  }
}

export default handleOnCommand
