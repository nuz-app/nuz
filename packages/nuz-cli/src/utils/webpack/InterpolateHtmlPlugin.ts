// https://github.com/facebook/create-react-app/blob/26a1c7f6b38fe7119a8fd92d10eb63597376d7de/packages/react-dev-utils/InterpolateHtmlPlugin.js#L19

import escapeStringRegexp from 'escape-string-regexp'

class InterpolateHtmlPlugin {
  htmlWebpackPlugin: any
  replacements: any

  constructor(htmlWebpackPlugin, replacements) {
    this.htmlWebpackPlugin = htmlWebpackPlugin
    this.replacements = replacements
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (compilation) => {
      this.htmlWebpackPlugin
        .getHooks(compilation)
        .afterTemplateExecution.tap('InterpolateHtmlPlugin', (data) => {
          // Run HTML through a series of user-specified string replacements.
          Object.keys(this.replacements).forEach((key) => {
            const value = this.replacements[key]
            data.html = data.html.replace(
              new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
              value,
            )
          })
        })
    })
  }
}

export default InterpolateHtmlPlugin
