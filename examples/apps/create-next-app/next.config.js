const nuz = require('@nuz/core')

const { withNuz } = nuz.nextHelpersFactory({
  require,
})

module.exports = withNuz();
