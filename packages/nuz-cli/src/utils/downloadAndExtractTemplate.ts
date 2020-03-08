import { got } from '@nuz/utils'
import tar from 'tar'

import { repoTarFile, resolvePathTemplte } from './getGitUrls'

const downloadAndExtractTemplate = async (dir: string, name: string) => {
  const response = await got({
    method: 'get',
    url: repoTarFile(),
    responseType: 'stream',
  })

  return response.data.pipe(
    tar.extract({ cwd: dir, strip: 3 }, [resolvePathTemplte(name)]),
  )
}

export default downloadAndExtractTemplate
