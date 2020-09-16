import type webpack from 'webpack'

function createRule(
  test: RegExp,
  exclude?: RegExp,
  use?: any[],
): webpack.RuleSetRule & { use: webpack.RuleSetUseItem[] } {
  return {
    test,
    exclude,
    use: use || [],
  }
}

export default createRule
