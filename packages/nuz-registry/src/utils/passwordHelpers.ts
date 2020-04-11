import bcrypt from 'bcrypt'

export const genarate = (password: string): string =>
  bcrypt.hashSync(password, 10)

export const compare = (data: any, encrypted: string): boolean =>
  bcrypt.compareSync(data, encrypted)
