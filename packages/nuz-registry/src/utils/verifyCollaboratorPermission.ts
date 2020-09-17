import { Collaborator, CollaboratorTypes, UserId } from '../types'

import * as collaboratorTypeHelpers from './collaboratorTypeHelpers'
import findCollaborator from './findCollaborator'

function verifyCollaboratorPermission(
  collaborators: Collaborator[],
  userId: UserId,
  requiredType: CollaboratorTypes,
): boolean {
  const selectedCollaborator = findCollaborator(collaborators, userId)
  if (!selectedCollaborator) {
    throw new Error('This collaborator was not found in the list.')
  }

  //
  return collaboratorTypeHelpers.verify(selectedCollaborator.type, requiredType)
}

export default verifyCollaboratorPermission
