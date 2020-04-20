import { Collaborator, CollaboratorTypes, UserId } from '../types'

import checkIsCollaboratorIncludes from './checkIsCollaboratorIncludes'
import * as collaboratorTypesHelpers from './collaboratorTypesHelpers'

const checkIsCollaboratorAllowSet = (
  collaborators: Collaborator[],
  userId: UserId,
  requiredType: CollaboratorTypes,
) => {
  const collaborator = checkIsCollaboratorIncludes(collaborators, userId)
  if (!collaborator) {
    throw new Error('Collaborator is not found')
  }

  const isAllowToSet = collaboratorTypesHelpers.verify(
    collaborator.type,
    requiredType,
  )
  return isAllowToSet
}

export default checkIsCollaboratorAllowSet
