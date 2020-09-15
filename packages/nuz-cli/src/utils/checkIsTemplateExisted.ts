import { checkIsUrlOk } from '@nuz/utils'

import * as getGitUrls from './getGitUrls'

function checkIsTemplateExisted(template: string): Promise<boolean> {
  return checkIsUrlOk(getGitUrls.packageJson(template))
}

export default checkIsTemplateExisted
