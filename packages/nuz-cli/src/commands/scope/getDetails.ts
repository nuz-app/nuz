import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function getDetails({
  scope: id,
  fields,
}: Arguments<{
  scope: string
  fields: string[]
}>) {
  if (!id || !fields) {
    throw new Error('Missing scope id or fields to get details of scope')
  }

  const tick = timer()
  const request = await Worker.getScope(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )

  const details = request?.data?.scope
  if (!details) {
    info(`Not found ${print.name(id)} scope`)
  } else {
    info(`Details of ${print.name(id)} scope`)
    log(pretty(details))
  }

  success(`Done in ${print.time(tick())}.`)
  return true
}

export default getDetails
