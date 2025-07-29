module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // _로 시작하는 unused 변수는 허용 (e.g. (_, idx) => ...)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    'react-hooks/exhaustive-deps': 'warn',
  },
};
