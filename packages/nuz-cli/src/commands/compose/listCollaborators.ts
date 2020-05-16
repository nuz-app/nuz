import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty, success } from '../../utils/print'
import timer from '../../utils/timer'

async function listCollaborators({
  compose: id,
}: Arguments<{ compose: string }>) {
  const tick = timer()
  const request = await Worker.getCollaboratorsOfCompose(id)

  const composeId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(`Collaborators of ${print.name(composeId)} compose`)
  log(pretty(collaborators))
  success(`Done in ${print.bold(tick())}ms.`)
  return true
}

export default listCollaborators
