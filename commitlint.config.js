module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "meta",
        "refactor",
        "test",
        "chore",
        "ci",
        "perf",
      ]
    ],
    "body-max-line-length": [2, "always", 200],
  },
}
