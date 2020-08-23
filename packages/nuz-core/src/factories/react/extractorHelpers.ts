import React from 'react'
import ReactDOMServer from 'react-dom/server'

export function renderer(element: any): string {
  return ReactDOMServer.renderToStaticMarkup(element)
}

export function parser(
  definedElement: any,
): React.CElement<any, React.Component<any, any, any>> {
  return React.createElement(definedElement.type, definedElement.attributes)
}
