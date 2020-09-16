import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ScopeGetDetailsOptions
  extends Arguments<{
    scope: string
    fields: string[]
  }> {}

async function getDetails(options: ScopeGetDetailsOptions): Promise<boolean> {
  const { scope: id, fields } = options

  if (!id || !fields) {
    throw new Error('Missing information to get the scope.')
  }

  // Create a request to perform this action.
  const request = await Worker.getScope(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )
  const details = request?.data?.scope

  const isNotFound = !details
  info.apply(
    info,
    isNotFound
      ? [`The scope ${print.name(id)} is not found.`]
      : [`The scope ${print.name(id)} details is`, pretty(details)],
  )
  log()

  return true
}

export default getDetails
