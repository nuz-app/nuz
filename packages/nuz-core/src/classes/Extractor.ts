import { DefinedElement, Priorities } from '../utils/documentHelpers'
import collectPreloadElements from '../utils/effects/collectPreloadElements'

export interface ExtractorPrepareConfiguration<
  P extends unknown,
  R extends unknown
> {
  parser: P
  renderer: R
}

export interface CollectTagsResult {
  elements: {
    styles: DefinedElement[]
    preload: DefinedElement[]
    scripts: DefinedElement[]
  }
  preload: string
  styles: string
  scripts: string
}

function renderToString(
  elements: DefinedElement[],
  parser: any,
  renderer: any,
): string {
  let html = (elements || []).reduce((acc, element) => {
    // Parse element and render to string
    acc.add(renderer(parser(element)))

    return acc
  }, new Set<string>())

  // Merge all html into once
  html = Array.from<string>(html.values()).join('') as any

  return html as any
}

class Extractor<P = any, R = any> {
  private readonly session: Set<string>

  private parser?: P
  private renderer?: R

  constructor() {
    this.session = new Set()
  }

  public prepare(configuration: ExtractorPrepareConfiguration<P, R>): void {
    const { parser, renderer } = configuration

    this.parser = parser
    this.renderer = renderer
  }

  public setup(): void {
    this.session.clear()
  }

  public teardown(): void {
    this.session.clear()
  }

  public push(id: string): void {
    this.session.add(id)
  }

  public collectElements(): DefinedElement[] {
    // Get all module ids resolved in the session
    const resolvedIds = Array.from(this.session.values())
    const elements = collectPreloadElements(resolvedIds)

    return elements
  }

  public appendIntoDocument(document: string): string {
    const { preload, styles, scripts } = this.collectTags()

    // Append preload and styles into head
    let html = document.replace(/(\<\s?head\s?\>)/i, `$1${preload}${styles}`)

    // Append scripts into body
    html = html.replace(/(\<\/\s?body\>)/i, `${scripts}$1`)

    return html
  }

  public collectTags(): CollectTagsResult {
    const elements = this.collectElements()

    // Grouping the elements based on type and attributes
    const grouped = elements.reduce(
      (acc, defined) => {
        // Should be included link tags and scripts for configuration
        if (
          defined.type === 'link' ||
          defined.attributes?.priority === Priorities.high
        ) {
          acc.preload.push(defined)
          return acc
        }

        // Other style tags
        if (defined.type === 'style') {
          acc.styles.push(defined)
        }

        // And scripts tags
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

    // Render all elements to html
    const styles = renderToString(
      grouped.styles || [],
      this.renderer,
      this.parser,
    )
    const preload = renderToString(
      grouped.preload || [],
      this.renderer,
      this.parser,
    )
    const scripts = renderToString(
      grouped.scripts || [],
      this.renderer,
      this.parser,
    )

    return {
      elements: grouped,
      styles,
      preload,
      scripts,
    }
  }
}

export default Extractor
