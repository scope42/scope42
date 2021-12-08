// https://github.com/vercel/next.js/issues/25454#issuecomment-903513941
const withTM = require('next-transpile-modules')(['react-markdown']);

module.exports = withTM({
  reactStrictMode: false, // react-cytoscapejs doesn't work otherwise...
})
