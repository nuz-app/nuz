import { got } from '@nuz/utils'
import tar from 'tar'

import * as getGitUrls from './getGitUrls'

const downloadAndExtractTemplate = async (dir: string, name: string) => {
  const response = await got({
    url: getGitUrls.tarFile(),
    method: 'get',
    responseType: 'stream',
  })

  return response.data.pipe(
    tar.extract({ cwd: dir, strip: 3 }, [getGitUrls.templatePath(name)]),
  )
}

export default downloadAndExtractTemplate
