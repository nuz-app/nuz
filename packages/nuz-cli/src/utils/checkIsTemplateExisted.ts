import { checkIsUrlOk } from '@nuz/utils'

import * as getGitUrls from './getGitUrls'

const checkIsTemplateExisted = (name: string): Promise<boolean> =>
  checkIsUrlOk(getGitUrls.packageJson(name))

export default checkIsTemplateExisted
