import _camelCase from 'lodash/camelCase'
import _upperFirst from 'lodash/upperFirst'

import createQuestions from '../../utils/createQuestions'

const getNameQuestion = () => ({
  type: 'string',
  name: 'name',
  message: `What is your module named?`,
  validate: (value: string) => !!value,
})

const getLibraryQuestion = (defaultValue: string) => ({
  type: 'string',
  name: 'library',
  message: `Set library name (exported name)`,
  default: defaultValue,
})

const getVersionQuestion = () => ({
  type: 'string',
  name: 'version',
  message: `Version`,
  default: '0.1.0',
})

const getTemplateQuestion = () => ({
  type: 'string',
  name: 'template',
  message: `What template you want to use?`,
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
}: Pick<InfoResults, 'name' | 'template'>): Promise<
  InfoResults | undefined
> => {
  const { name } =
    (_name && { name: _name }) ||
    (await createQuestions<Pick<InfoResults, 'name'>>([getNameQuestion()]))
  if (!name) {
    return undefined
  }

  const restQuestions = [
    getLibraryQuestion(_upperFirst(_camelCase(name))),
    getVersionQuestion(),
  ]

  if (!_template) {
    restQuestions.unshift(getTemplateQuestion() as any)
  }

  const { library, template = _template, version } = await createQuestions<
    Omit<InfoResults, 'name'>
  >(restQuestions)

  return { name, library, template, version }
}

export default createQuestionsGetInfo
