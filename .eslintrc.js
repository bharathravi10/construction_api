module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: { project: 'tsconfig.json', tsconfigRootDir: __dirname },
    plugins: ['@typescript-eslint'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'prettier',
    ],
    root: true,
    env: { node: true, jest: true },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  };
  