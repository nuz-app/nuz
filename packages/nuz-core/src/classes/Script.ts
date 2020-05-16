import { ModuleFormats } from '@nuz/shared'
import vm from 'vm'

import getCodeTemplate, {
  Defined,
  setVariables,
  TemplateTypes,
} from '../utils/getCodeTemplate'
import runScriptInContext from '../utils/runScriptInContext'

const CONTEXT_KET = '__context__'

export type Globals = Window | typeof globalThis

export interface ScriptConfig {
  format: ModuleFormats
}

const defaultConfig = {
  format: ModuleFormats.umd,
}

class Script {
  private _config: ScriptConfig

  constructor(private readonly code: string, config?: ScriptConfig) {
    this._config = Object.assign({}, defaultConfig, config)
  }

  private generateId() {
    const id = Math.random().toString(36).substring(7)
    const now = Date.now()
    const name = ['fn', now, id].join('_')
    return name
  }

  getContextTemplate(defined: Defined) {
    return setVariables(
      getCodeTemplate(TemplateTypes.context, this._config.format),
      defined,
    )
  }

  runInContext(context: any) {
    const name = this.generateId()
    const code = this.getContextTemplate({
      name,
      code: this.code,
      context: CONTEXT_KET,
    })

    vm.createContext(context)
    vm.runInContext(code, context)

    return context
  }

  getScriptTemplate(defined: Defined) {
    return setVariables(
      getCodeTemplate(TemplateTypes.script, this._config.format),
      defined,
    )
  }

  runInScript(context: any) {
    const name = this.generateId()
    const code = this.getScriptTemplate({
      name,
      code: this.code,
      context: CONTEXT_KET,
    })

    runScriptInContext(code, context)
    return context
  }
}

export default Script
