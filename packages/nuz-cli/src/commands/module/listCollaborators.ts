import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function listCollaborators({
  module: id,
}: Arguments<{ module: string }>) {
  const tick = timer()
  const request = await Worker.getCollaboratorsOfModule(id)

  const moduleId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(`Collaborators of ${print.name(moduleId)} module`)
  log(pretty(collaborators))
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default listCollaborators
