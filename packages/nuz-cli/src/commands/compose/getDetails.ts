import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function getDetails({
  compose: id,
  fields,
}: Arguments<{
  compose: string
  fields: string[]
}>) {
  if (!id || !fields) {
    throw new Error('Missing compose id or fields to get details of compose')
  }

  const tick = timer()
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

  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default getDetails
