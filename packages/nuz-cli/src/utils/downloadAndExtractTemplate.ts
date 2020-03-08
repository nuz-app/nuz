import axios from 'axios'
import promisePipe from 'promisepipe'
import tar from 'tar'

import { repoTarFile, resolvePathTemplte } from './getGitUrls'

const downloadAndExtractTemplate = (dir: string, name: string) =>
  promisePipe(
    axios.get(repoTarFile(), { responseType: 'stream' }), // TODO: check it!
    tar.extract({ cwd: dir, strip: 3 }, [resolvePathTemplte(name)]),
  )

export default downloadAndExtractTemplate
