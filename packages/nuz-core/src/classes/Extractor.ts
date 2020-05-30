import { DefinedElement, Priorities } from '../utils/DOMHelpers'
import getElementsInHead from '../utils/effects/getElementsInHead'

function renderElements(elements, renderer, parser) {
  return Array.from(
    (elements || [])
      .reduce((tags, element) => {
        tags.add(renderer(parser(element)))
        return tags
      }, new Set())
      .values(),
  ).join('')
}

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

    const stylesTags = renderElements(
      groupsElements.styles || [],
      this._renderer,
      this._parser,
    )
    const preloadTags = renderElements(
      groupsElements.preload || [],
      this._renderer,
      this._parser,
    )
    const scriptsTags = renderElements(
      groupsElements.scripts || [],
      this._renderer,
      this._parser,
    )

    return {
      groupsElements,
      stylesTags,
      preloadTags,
      scriptsTags,
    }
  }
}

export default Extractor
