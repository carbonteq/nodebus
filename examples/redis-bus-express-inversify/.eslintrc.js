module.exports = {
  /* "$schema": "https://json.schemastore.org/eslintrc.json", */
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    browser: false,
    node: true,
  },
  ignorePatterns: [
    '.eslintrc',
    'node_modules',
    '.eslintrc.json',
    '.prettierrc',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
