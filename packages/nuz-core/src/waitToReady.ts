import { deferedPromise } from '@nuz/utils'

const readyPromise = deferedPromise<boolean>()

export const ok = () => readyPromise.resolve(true)

export const wait = () => readyPromise.promise
