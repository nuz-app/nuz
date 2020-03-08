import { checkIsUrlOk } from '@nuz/utils'

import { templatePackageJson } from './getGitUrls'

const checkIsTemplateExisted = (name: string): Promise<boolean> =>
  checkIsUrlOk(templatePackageJson(name))

export default checkIsTemplateExisted
