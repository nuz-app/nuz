import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty } from '../../utils/print'

async function listCollaborators({
  module: id,
}: Arguments<{ module: string }>) {
  const request = await Worker.getCollaboratorsOfModule(id)

  const moduleId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(`Collaborators of ${print.name(moduleId)} module`)
  log(pretty(collaborators))
  return true
}

export default listCollaborators
