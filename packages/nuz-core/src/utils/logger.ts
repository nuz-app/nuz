export function error(this: any, ...rest: any[]) {
  console.error.apply(this, rest as any)
}

export function warn(this: any, ...rest: any[]) {
  console.warn.apply(this, rest as any)
}

export function log(this: any, ...rest: any[]) {
  console.log.apply(this, rest as any)
}
