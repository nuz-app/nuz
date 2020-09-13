import { error } from './print'
import { exit } from './process'

type Caller = (...rest: any[]) => Promise<any>

function wrapCommand(caller: Caller): Caller {
  return async function (...rest) {
    try {
      const closed = await caller(...rest)
      if (closed) {
        return exit(0)
      }
    } catch (err) {
      error(err)
      return exit(1)
    }
  }
}

export default wrapCommand
