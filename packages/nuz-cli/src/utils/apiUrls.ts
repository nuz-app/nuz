export const createToken = (endpoint: string) => ({
  url: `${endpoint}/permission`,
  method: 'POST',
})

export const deleteToken = (endpoint: string) => ({
  url: `${endpoint}/permission`,
  method: 'DELETE',
})

export const setScope = (endpoint: string) => ({
  url: `${endpoint}/permission/scope`,
  method: 'POST',
})

export const removeScope = (endpoint: string) => ({
  url: `${endpoint}/permission/scope`,
  method: 'DELETE',
})

export const extendScope = (endpoint: string) => ({
  url: `${endpoint}/permission/scope`,
  method: 'PUT',
})

export const publishModule = (endpoint: string) => ({
  url: `${endpoint}/module`,
  method: 'POST',
})

// User

export const createUser = (endpoint: string) => ({
  url: `${endpoint}/user`,
  method: 'POST',
})

export const loginUser = (endpoint: string) => ({
  url: `${endpoint}/user/login`,
  method: 'POST',
})

export const createTokenForUser = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/user/token`,
  method: 'POST',
  headers: { authorization },
})

export const deleteTokenFromUser = (endpoint: string) => ({
  url: `${endpoint}/user/token`,
  method: 'DELETE',
})

// Scope

export const addCollaboratorToScope = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'POST',
  headers: { authorization },
})

export const updateCollaboratorOfScope = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'PUT',
  headers: { authorization },
})

export const removeCollaboratorFromScope = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'DELETE',
  headers: { authorization },
})

// Module

export const setDeprecateForModule = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/module/deprecate`,
  method: 'PUT',
  headers: { authorization },
})

export const addCollaboratorToModule = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/module/collaborator`,
  method: 'POST',
  headers: { authorization },
})

export const updateCollaboratorOfModule = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/module/collaborator`,
  method: 'PUT',
  headers: { authorization },
})

export const removeCollaboratorFromModule = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/module/collaborator`,
  method: 'DELETE',
  headers: { authorization },
})

// Composition

export const addCollaboratorToComposition = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/composition/collaborator`,
  method: 'POST',
  headers: { authorization },
})

export const updateCollaboratorOfComposition = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/composition/collaborator`,
  method: 'PUT',
  headers: { authorization },
})

export const removeCollaboratorFromComposition = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/composition/collaborator`,
  method: 'DELETE',
  headers: { authorization },
})
