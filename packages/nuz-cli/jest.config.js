module.exports = {
  rootDir: process.cwd(),
  testEnvironment: "node",
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
