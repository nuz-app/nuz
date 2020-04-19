import { Collaborator, UserId } from '../types'

import compareObjectId from './compareObjectId'

const checkIsCollaboratorIncludes = (
  collaborators: Collaborator[],
  userId: UserId,
) => collaborators.find((item) => compareObjectId(item.id, userId))

export default checkIsCollaboratorIncludes
