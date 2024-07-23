module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'warn', // Change this line
    'react/no-unstable-nested-components': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    'no-bitwise': 'off',
  },
};
