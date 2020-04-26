import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty } from '../../utils/print'

async function listCollaborators({ scope: id }: Arguments<{ scope: string }>) {
  const request = await Worker.getCollaboratorsOfScope(id)

  const scopeId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(`Collaborators of ${print.name(scopeId)} scope`)
  log(pretty(collaborators))
  return true
}

export default listCollaborators
