import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty, success } from '../../utils/print'

async function getDetails({
  module: id,
  fields,
}: Arguments<{
  module: string
  fields: string[]
}>) {
  if (!id || !fields) {
    throw new Error('Missing module id or fields to get details of module')
  }

  const request = await Worker.getModule(
    id,
    (!fields || fields.length) === 0 ? undefined : fields,
  )

  const details = request?.data?.module
  if (!details) {
    info(`Not found ${print.name(id)} module`)
  } else {
    info(`Details of ${print.name(id)} module`)
    log(pretty(details))
  }

  success('Done!')
  return true
}

export default getDetails
