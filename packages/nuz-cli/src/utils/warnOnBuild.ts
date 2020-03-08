import { warn } from './print'

const warnOnBuild = ({ loc, frame, message }) => {
  if (loc) {
    warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
    if (frame) {
      warn(frame)
    }
  } else {
    warn(message)
  }
}

export default warnOnBuild
