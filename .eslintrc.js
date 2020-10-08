module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-template': 0,
    'no-param-reassign': 0,
    // allow ForOf statement but retain ban on the others
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-console': 0,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
  },
};
