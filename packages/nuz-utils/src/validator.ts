export const name = (value: string) =>
  typeof value === 'string' && value.length >= 4 && value.length <= 32

export const username = (value: string) =>
  typeof value === 'string' &&
  /^([a-zA-Z0-9]{1}[a-zA-Z0-9\_\-]+[a-zA-Z0-9]{1})$/.test(value) &&
  value.length <= 24

export const email = (value: string) =>
  typeof value === 'string' &&
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)

export const password = (value: string) =>
  typeof value === 'string' && value.length >= 8
