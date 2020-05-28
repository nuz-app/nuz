import getElementsInHead from '../getElementsInHead'
import { DefinedElement, Priorities } from '../utils/DOMHelpers'

class Extractor {
  private readonly _session: Set<string>

  private _parser?: any
  private _renderer?: any

  constructor() {
    this._session = new Set()
  }

  public prepare({ parser, renderer }) {
    this._parser = parser
    this._renderer = renderer
  }

  public async setup() {
    this._session.clear()
  }

  public async teardown() {
    this._session.clear()
  }

  public async push(id: string) {
    this._session.add(id)
  }

  public getAllElements() {
    const resolvedIds = Array.from(this._session.values())
    const elements = getElementsInHead(resolvedIds)

    return elements
  }

  public appendTagsToHTML(html: string) {
    const allTags = this.getAllTags()

    let result = html
    result = result.replace(
      /(\<\s?head\s?\>)/i,
      `$1${allTags.preloadTags}${allTags.stylesTags}`,
    )
    result = result.replace(/(\<\/\s?body\>)/i, `${allTags.scriptsTags}$1`)

    return result
  }

  public getAllTags() {
    const allElements = this.getAllElements()
    const groupsElements = allElements.reduce(
      (acc, defined) => {
        if (
          defined.type === 'link' ||
          defined.attributes?.priority === Priorities.high
        ) {
          acc.preload.push(defined)
          return acc
        }

        if (defined.type === 'style') {
          acc.styles.push(defined)
        }

        if (defined.type === 'script') {
          acc.scripts.push(defined)
        }

        return acc
      },
      {
        styles: [] as DefinedElement[],
        preload: [] as DefinedElement[],
        scripts: [] as DefinedElement[],
      },
    )

    const stylesTags = (groupsElements.styles || [])
      .map((element) => this._renderer(this._parser(element)))
      .join('')
    const preloadTags = (groupsElements.preload || [])
      .map((element) => this._renderer(this._parser(element)))
      .join('')
    const scriptsTags = (groupsElements.scripts || [])
      .map((element) => this._renderer(this._parser(element)))
      .join('')

    return {
      groupsElements,
      stylesTags,
      preloadTags,
      scriptsTags,
    }
  }
}

export default Extractor
