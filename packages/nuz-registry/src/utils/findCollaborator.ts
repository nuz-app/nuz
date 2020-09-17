import { Collaborator, UserId } from '../types'

function findCollaborator(
  collaborators: Collaborator[],
  userId: UserId,
): Collaborator | undefined {
  return collaborators.find((item) => item.id === userId)
}

export default findCollaborator
