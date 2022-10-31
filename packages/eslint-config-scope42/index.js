module.exports = {
  extends: ['react-app', 'react-app/jest', 'turbo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error']
    // '@next/next/no-html-link-for-pages': 'off'
    // 'react/jsx-key': 'off'
  }
}
