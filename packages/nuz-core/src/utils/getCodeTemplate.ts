import { ModuleFormats } from '../types/common'

const SCRIPTS = {
  [ModuleFormats.umd]: `({%}code{%})`,
}

const CONTEXTS = {
  [ModuleFormats.umd]: `({%}code{%})`,
}

export enum TemplateTypes {
  script = 'script',
  context = 'context',
}

type Defined = { [field: string]: string }

export function setVariables(template: string, defined: Defined) {
  let result = template || ''

  if (!defined) {
    return template
  }

  // tslint:disable-next-line: forin
  for (const field in defined) {
    result = result.replace(
      new RegExp(`\\({%}${field}{%}\\)`, 'g'),
      defined[field],
    )
  }

  return result
}

const getCodeTemplate = (type: TemplateTypes, format: ModuleFormats) => {
  const lib = type === TemplateTypes.script ? SCRIPTS : CONTEXTS
  const template = lib[format]
  return template
}

export default getCodeTemplate
