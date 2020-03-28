module.exports = {
  rootDir: process.cwd(),
  testEnvironment: "node",
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testMatch: ["**/?(*.)+(spec|test).[jt]sx?$"],
};
