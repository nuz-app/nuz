interface RequestAPI {
  url: string
  method: string
  headers?: any
}

// User

export const createUser = (endpoint: string): RequestAPI => ({
  url: `${endpoint}/user`,
  method: 'POST',
})

export const loginUser = (endpoint: string): RequestAPI => ({
  url: `${endpoint}/user/login`,
  method: 'POST',
})

export const createTokenForUser = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/user/token`,
  method: 'POST',
  headers: { authorization },
})

export const deleteTokenFromUser = (endpoint: string): RequestAPI => ({
  url: `${endpoint}/user/token`,
  method: 'DELETE',
})

export const getAllComposeOfUser = (endpoint: string): RequestAPI => ({
  url: `${endpoint}/user/composes`,
  method: 'GET',
})

export const getAllScopesOfUser = (endpoint: string): RequestAPI => ({
  url: `${endpoint}/user/scopes`,
  method: 'GET',
})

export const getAllModulesOfUser = (endpoint: string): RequestAPI => ({
  url: `${endpoint}/user/modules`,
  method: 'GET',
})

// Scope

export const getScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope`,
  method: 'GET',
  headers: { authorization },
})

export const createScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope`,
  method: 'POST',
  headers: { authorization },
})

export const deleteScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope`,
  method: 'DELETE',
  headers: { authorization },
})

export const getCollaboratorsOfScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope/collaborators`,
  method: 'GET',
  headers: { authorization },
})

export const addCollaboratorToScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'POST',
  headers: { authorization },
})

export const updateCollaboratorOfScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'PUT',
  headers: { authorization },
})

export const removeCollaboratorFromScope = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/scope/collaborator`,
  method: 'DELETE',
  headers: { authorization },
})

// Module

export const getModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module`,
  method: 'GET',
  headers: { authorization },
})

export const publishModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module`,
  method: 'PUT',
  headers: { authorization },
})

export const setDeprecateForModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module/deprecate`,
  method: 'PUT',
  headers: { authorization },
})

export const setTagForModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module/tag`,
  method: 'PUT',
  headers: { authorization },
})

export const getCollaboratorsOfModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module/collaborators`,
  method: 'GET',
  headers: { authorization },
})

export const addCollaboratorToModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module/collaborator`,
  method: 'POST',
  headers: { authorization },
})

export const updateCollaboratorOfModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module/collaborator`,
  method: 'PUT',
  headers: { authorization },
})

export const removeCollaboratorFromModule = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/module/collaborator`,
  method: 'DELETE',
  headers: { authorization },
})

// Compose

export const getCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose`,
  method: 'GET',
  headers: { authorization },
})

export const createCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose`,
  method: 'POST',
  headers: { authorization },
})

export const deleteCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose`,
  method: 'DELETE',
  headers: { authorization },
})

export const getCollaboratorsOfCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose/collaborators`,
  method: 'GET',
  headers: { authorization },
})

export const addCollaboratorToCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose/collaborator`,
  method: 'POST',
  headers: { authorization },
})

export const updateCollaboratorOfCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose/collaborator`,
  method: 'PUT',
  headers: { authorization },
})

export const removeCollaboratorFromCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose/collaborator`,
  method: 'DELETE',
  headers: { authorization },
})

export const setModulesForCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose/modules`,
  method: 'PUT',
  headers: { authorization },
})

export const removeModulesFromCompose = (
  endpoint: string,
  authorization: string,
): RequestAPI => ({
  url: `${endpoint}/compose/modules`,
  method: 'DELETE',
  headers: { authorization },
})
