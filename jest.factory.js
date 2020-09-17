module.exports = ({ dir }) => ({
  rootDir: dir,
  testEnvironment: 'node',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {},
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.dev.json',
    },
  },
})
