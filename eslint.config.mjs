import airbnbBase from 'eslint-config-airbnb-base';
import prettier from 'eslint-plugin-prettier';
import node from 'eslint-plugin-node';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: { node: true, es2021: true },
    },
    plugins: {
      prettier,
      node,
    },
    rules: {
      ...airbnbBase.rules,
      ...prettierConfig.rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          tabWidth: 2,
        },
      ],
      'no-console': 'warn',
      'node/no-unsupported-features/es-syntax': 'off',
    },
  },
];