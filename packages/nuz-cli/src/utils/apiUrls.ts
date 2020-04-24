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

/**
 *
 */

export const createTokenForUser = (endpoint: string) => ({
  url: `${endpoint}/user/token`,
  method: 'POST',
})

export const deleteTokenFromUser = (endpoint: string) => ({
  url: `${endpoint}/user/token`,
  method: 'DELETE',
})
