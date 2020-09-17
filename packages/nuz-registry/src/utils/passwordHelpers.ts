import bcrypt from 'bcrypt'

export function genarate(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function compare(data: any, encrypted: string): boolean {
  return bcrypt.compareSync(data, encrypted)
}
