module.exports = {
  extends: ['./node_modules/@linzjs/style/.eslintrc.cjs', 'plugin:storybook/recommended'],
  ignorePatterns: ['**/*.js'],
  overrides: [
    {
      /** Overrides for typescript */
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        'react/prop-types': 'off',
        eqeqeq: 'off',
      },
    },
    {
      /** Overrides for typescript */
      files: ['**/*.stories.tsx'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        eqeqeq: 'off',
      },
    },
  ],
};
