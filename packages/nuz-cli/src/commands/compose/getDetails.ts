import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ComposeGetDetailsOptions
  extends Arguments<{
    compose: string
    fields: string[]
  }> {}

async function getDetails(options: ComposeGetDetailsOptions): Promise<boolean> {
  const { compose: id, fields } = options

  if (!id || !fields) {
    throw new Error('Missing information to get the compose details.')
  }

  // Create a request to perform this action.
  const request = await Worker.getCompose(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )
  const details = request?.data?.compose

  const isNotFound = !details
  info.apply(
    info,
    isNotFound
      ? [`The compose ${print.name(id)} is not found.`]
      : [`The compose ${print.name(id)} details is`, pretty(details)],
  )
  log()

  return true
}

export default getDetails
