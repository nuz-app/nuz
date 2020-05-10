import { checkIsUrlOk } from '@nuz/utils'

import * as getGitUrls from './getGitUrls'

const checkIsTemplateExisted = (template: string): Promise<boolean> =>
  checkIsUrlOk(getGitUrls.packageJson(template))

export default checkIsTemplateExisted
