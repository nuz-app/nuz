import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ModuleGetDetailsOptions
  extends Arguments<{
    module: string
    fields: string[]
  }> {}

async function getDetails(options: ModuleGetDetailsOptions): Promise<boolean> {
  const { module: id, fields } = options

  if (!id || !fields) {
    throw new Error('Missing information to get the module.')
  }

  // Create a request to perform this action.
  const request = await Worker.getModule(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )
  const details = request?.data?.module

  const isNotFound = !details
  info.apply(
    info,
    isNotFound
      ? [`The module ${print.name(id)} is not found.`]
      : [`The module ${print.name(id)} details is`, pretty(details)],
  )
  log()

  return true
}

export default getDetails
