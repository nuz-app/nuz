import React from 'react'
import ReactDOMServer from 'react-dom/server'

export function renderer(element) {
  return ReactDOMServer.renderToStaticMarkup(element)
}

export function parser(definedElement) {
  return React.createElement(definedElement.type, definedElement.attributes)
}
