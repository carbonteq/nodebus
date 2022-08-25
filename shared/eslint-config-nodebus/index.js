module.exports = {
  /* "$schema": "https://json.schemastore.org/eslintrc.json", */
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {},
  env: {
    browser: false,
    node: true,
    /* es2021: true, */
    jest: true,
  },
  ignorePatterns: [
    ".eslintrc",
    "node_modules",
    ".eslintrc.js",
    ".eslintrc.json",
    ".prettierrc",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true },
    ],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
