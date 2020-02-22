module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
  ],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', ['parent', 'sibling', 'index']],
        'newlines-between': 'always-and-inside-groups',
      },
    ],
    'no-console': 'error',
    'object-shorthand': ['warn', 'always', { avoidExplicitReturnArrows: true }],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
  },
}
