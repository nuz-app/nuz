import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ComposeListCollaboratorsOptions
  extends Arguments<{ compose: string }> {}

async function listCollaborators(
  options: ComposeListCollaboratorsOptions,
): Promise<boolean> {
  const { compose: id } = options

  // Create a request to perform this action.
  const request = await Worker.getCollaboratorsOfCompose(id)
  const composeId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(
    `The compose ${print.name(composeId)} collaborators are`,
    pretty(collaborators),
  )
  log()

  return true
}

export default listCollaborators
