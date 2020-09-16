import { Arguments } from 'yargs'

import Worker from '../../classes/Worker'
import print, { info, log, pretty } from '../../utils/print'

interface ModuleListCollaboratorsOptions
  extends Arguments<{ module: string }> {}

async function listCollaborators(
  options: ModuleListCollaboratorsOptions,
): Promise<boolean> {
  const { module: id } = options

  // Create a request to perform this action.
  const request = await Worker.getCollaboratorsOfModule(id)
  const moduleId = request?.data?._id
  const collaborators = request?.data?.collaborators

  info(
    `The module ${print.name(moduleId)} collaborators are`,
    pretty(collaborators),
  )
  log()

  return true
}

export default listCollaborators
