import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function getDetails({
  composition: id,
  fields,
}: Arguments<{
  composition: string
  fields: string[]
}>) {
  if (!id || !fields) {
    throw new Error(
      'Missing composition id or fields to get details of composition',
    )
  }

  const tick = timer()
  const request = await Worker.getComposition(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )

  const details = request?.data?.composition
  if (!details) {
    info(`Not found ${print.name(id)} composition`)
  } else {
    info(`Details of ${print.name(id)} composition`)
    log(pretty(details))
  }

  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default getDetails
