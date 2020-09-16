import print, { error, log } from './print'
import * as processHelpers from './process'
import timer from './timer'

type Caller = (...rest: any[]) => Promise<any>

function wrapCommand(caller: Caller): Caller {
  return async function (...rest) {
    const tick = timer()

    try {
      const closed = await caller(...rest)
      if (closed) {
        log(
          print.dim(
            `[👌] Request was successful, duration ${print.bold(
              print.time(tick()),
            )}.`,
          ),
        )

        //
        return processHelpers.exit(0)
      }
    } catch (err) {
      error(err)
      log()

      log(
        print.dim(
          `[💢] Request failed, duration ${print.bold(print.time(tick()))}.`,
        ),
      )
      log()
      //
      return processHelpers.exit(1)
    }
  }
}

export default wrapCommand
