import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

interface ComposeGetDetailsOptions
  extends Arguments<{
    compose: string
    fields: string[]
  }> {}

async function getDetails(options: ComposeGetDetailsOptions): Promise<boolean> {
  const { compose: id, fields } = options

  if (!id || !fields) {
    throw new Error('Missing compose id or fields to get the compose details.')
  }

  const tick = timer()

  //
  const request = await Worker.getCompose(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )
  const details = request?.data?.compose

  if (!details) {
    info(`Not found ${print.name(id)} compose`)
  } else {
    info(`Details of ${print.name(id)} compose`)
    log(pretty(details))
  }

  success(`Done in ${print.time(tick())}.`)

  return true
}

export default getDetails
