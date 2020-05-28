const path = require('path')
const factory = require('../../jest.factory')

module.exports = Object.assign(
  factory({
    dir: process.cwd(),
  }),
);
