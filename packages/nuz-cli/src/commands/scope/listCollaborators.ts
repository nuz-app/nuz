import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function listCollaborators({ scope: id }: Arguments<{ scope: string }>) {
  const tick = timer()
  const request = await Worker.getCollaboratorsOfScope(id)

  const scopeId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(`Collaborators of ${print.name(scopeId)} scope`)
  log(pretty(collaborators))
  success(`Done in ${print.time(tick())}.`)
  return true
}

export default listCollaborators
