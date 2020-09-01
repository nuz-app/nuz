export interface ModuleIdParsed {
  id: string
  module: string
  version: string
  scope: string
  name: string
}

const REGEXP = /^(@([\s\S]+)\/)?([^@]+)(@([\s\S]+))?/

export function parser(id: string): ModuleIdParsed {
  const matched = id.match(REGEXP)
  if (!matched) {
    throw new Error(`Can't parse module id because it's invalid`)
  }

  const [, , scope, name, , version] = matched
  const module = `${matched[1]}${matched[3]}`

  return {
    id,
    module,
    version,
    scope,
    name,
  }
}

parser.silent = function silent(id: string): ModuleIdParsed | null {
  try {
    return parser.apply(this, arguments as any)
  } catch {
    return null
  }
}

export function create(name: string, version: string = '*'): string {
  return `${name}@${version}`
}

export function use(idOrName: string): string {
  const parsed = parser(idOrName)

  return create(parsed.module, parsed.version)
}
