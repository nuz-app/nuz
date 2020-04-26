import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'

import print, { info, log, pretty } from '../../utils/print'

async function listCollaborators({
  composition: id,
}: Arguments<{ composition: string }>) {
  const request = await Worker.getCollaboratorsOfComposition(id)

  const compositionId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(`Collaborators of ${print.name(compositionId)} composition`)
  log(pretty(collaborators))
  return true
}

export default listCollaborators
