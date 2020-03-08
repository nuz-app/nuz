import Events from './classes/Events'

export const emitter = new Events()

export default {
  on: (type, ...rest) => emitter.on(type, ...rest),
  off: (type, ...rest) => emitter.off(type, ...rest),
}
