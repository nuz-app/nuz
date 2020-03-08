import _camelCase from 'lodash/camelCase'
import _upperFirst from 'lodash/upperFirst'

import createQuestions from '../../utils/createQuestions'

const getNameQuestion = () => ({
  type: 'string',
  name: 'name',
  message: `Module name:`,
  validate: value => !!value,
})

const getLibraryQuestion = (defaultValue: string) => ({
  type: 'string',
  name: 'library',
  message: `Library name (exported name):`,
  default: defaultValue,
})

const getVersionQuestion = () => ({
  type: 'string',
  name: 'version',
  message: `Version:`,
  default: '0.1.0',
})

const getTemplateQuestion = () => ({
  type: 'string',
  name: 'template',
  message: `Template using:`,
  default: false,
})

interface InfoResults {
  name: string
  template: string
  library: string
  version: string
}

const createQuestionsGetInfo = async ({
  name: _name,
  template: _template,
}: Pick<InfoResults, 'name' | 'template'>): Promise<InfoResults> => {
  const { name } =
    (_name && { name: _name }) ||
    (await createQuestions<Pick<InfoResults, 'name'>>([getNameQuestion()]))
  if (!name) {
    return null
  }

  const restQuestions = [
    !_template && getTemplateQuestion(),
    getLibraryQuestion(_upperFirst(_camelCase(name))),
    getVersionQuestion(),
  ].filter(Boolean)

  const { library, template = _template, version } = await createQuestions<
    Omit<InfoResults, 'name'>
  >(restQuestions)

  return { name, library, template, version }
}

export default createQuestionsGetInfo
