module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  testRegex: "/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
};
