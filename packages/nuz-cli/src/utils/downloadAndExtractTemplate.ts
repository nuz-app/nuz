import { got } from '@nuz/utils'
import tar from 'tar'

import * as getGitUrls from './getGitUrls'

async function downloadAndExtractTemplate(
  dir: string,
  template: string,
  callback?: any,
) {
  const response = await got({
    url: getGitUrls.tarFile(),
    method: 'get',
    responseType: 'stream',
  })

  if (typeof callback === 'function') {
    callback(response)
  }

  return response.data.pipe(
    tar.extract({ cwd: dir, strip: 3 }, [getGitUrls.templatePath(template)]),
  )
}

export default downloadAndExtractTemplate
