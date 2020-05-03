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

export const getAllCompositionsOfUser = (endpoint: string) => ({
  url: `${endpoint}/user/compositions`,
  method: 'GET',
})

export const getAllScopesOfUser = (endpoint: string) => ({
  url: `${endpoint}/user/scopes`,
  method: 'GET',
})

export const getAllModulesOfUser = (endpoint: string) => ({
  url: `${endpoint}/user/modules`,
  method: 'GET',
})

// Scope

export const getScope = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/scope`,
  method: 'GET',
  headers: { authorization },
})

export const createScope = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/scope`,
  method: 'POST',
  headers: { authorization },
})

export const deleteScope = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/scope`,
  method: 'DELETE',
  headers: { authorization },
})

export const getCollaboratorsOfScope = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/scope/collaborators`,
  method: 'GET',
  headers: { authorization },
})

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

export const getModule = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/module`,
  method: 'GET',
  headers: { authorization },
})

export const publishModule = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/module`,
  method: 'PUT',
  headers: { authorization },
})

export const setDeprecateForModule = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/module/deprecate`,
  method: 'PUT',
  headers: { authorization },
})

export const getCollaboratorsOfModule = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/module/collaborators`,
  method: 'GET',
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

export const getComposition = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/composition`,
  method: 'GET',
  headers: { authorization },
})

export const createComposition = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/composition`,
  method: 'POST',
  headers: { authorization },
})

export const deleteComposition = (endpoint: string, authorization: string) => ({
  url: `${endpoint}/composition`,
  method: 'DELETE',
  headers: { authorization },
})

export const getCollaboratorsOfComposition = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/composition/collaborators`,
  method: 'GET',
  headers: { authorization },
})

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

export const setModulesForComposition = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/composition/modules`,
  method: 'PUT',
  headers: { authorization },
})

export const removeModulesFromComposition = (
  endpoint: string,
  authorization: string,
) => ({
  url: `${endpoint}/composition/modules`,
  method: 'DELETE',
  headers: { authorization },
})
