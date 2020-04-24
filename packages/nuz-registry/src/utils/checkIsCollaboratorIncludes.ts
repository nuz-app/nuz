import { Collaborator, UserId } from '../types'

const checkIsCollaboratorIncludes = (
  collaborators: Collaborator[],
  userId: UserId,
) => collaborators.find((item) => item.id === userId)

export default checkIsCollaboratorIncludes
