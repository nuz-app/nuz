import Events from './classes/Events'

export const emitter = new Events()

export default {
  on: (type: string, ...rest: any[]) => emitter.on(type, ...rest),
  off: (type: string, ...rest: any[]) => emitter.off(type, ...rest),
}
