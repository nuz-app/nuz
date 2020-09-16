import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ScopeListCollaboratorsOptions extends Arguments<{ scope: string }> {}

async function listCollaborators(
  options: ScopeListCollaboratorsOptions,
): Promise<boolean> {
  const { scope: id } = options

  // Create a request to perform this action.
  const request = await Worker.getCollaboratorsOfScope(id)
  const scopeId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(
    `The scope ${print.name(scopeId)} collaborators are`,
    pretty(collaborators),
  )
  log()

  return true
}

export default listCollaborators
