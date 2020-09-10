import { CHANGES_EMOJI } from '../lib/const'

import print, { log } from './print'

function printWaitingForChanges(time: number): void {
  const idx = Math.floor(Math.random() * CHANGES_EMOJI.length)
  const emoji = CHANGES_EMOJI[idx]
  const text = isNaN(time) ? '' : ` in ${print.time(time)}`

  log(print.dim(`[👀] build done${text}, watching for changes...`, emoji))
}

export default printWaitingForChanges
