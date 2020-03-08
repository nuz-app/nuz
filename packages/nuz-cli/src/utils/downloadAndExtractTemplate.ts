import got from 'got'
import promisePipe from 'promisepipe'
import tar from 'tar'

import { repoTarFile, resolvePathTemplte } from './getGitUrls'

const downloadAndExtractTemplate = (dir: string, name: string) =>
  promisePipe(
    got.stream(repoTarFile()),
    tar.extract({ cwd: dir, strip: 3 }, [resolvePathTemplte(name)]),
  )

export default downloadAndExtractTemplate
