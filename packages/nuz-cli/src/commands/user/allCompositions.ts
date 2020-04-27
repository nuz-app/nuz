import Config from '../../classes/Config'
import Worker from '../../classes/Worker'

import print, { info, pretty, success } from '../../utils/print'

async function allCompositions() {
  const auth = await Config.authRequired()
  const request = await Worker.getAllCompositionsOfUser(auth.id)
  const compositions = request?.data?.compositions

  info(
    `Compositions list of ${print.name(auth.username)}, ${print.bold(
      compositions.length,
    )} items`,
  )
  info(pretty(compositions))
  success('Done!')
  return true
}

export default allCompositions
