const config = {
  // "$schema": "https://json.schemastore.org/eslintrc.json",
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: {
    "browser": false,
    "node": true,
    "es2021": true,
    "jest": true
  },
  ignorePatterns: [".eslintrc", "node_modules"],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  }
}

module.exports = config