const fs = require('fs')
const scope = require('scope-css')
const copyfiles = require('copyfiles')

// The aim42 content we include has been rendered using asciidoctor.js. To
// display it correctly, we need to include the related CSS. By default, it
// would conflict with our own styles. To avoid this, we scope it to only apply
// whithin a certain class.

const aim42Css = fs.readFileSync(
  'node_modules/@scope42/structured-aim42/resources/css/aim42.css',
  'utf8'
)

// The imported Google Font is removed to protect privacy.
// If we want to use it, we need to include it in the app directly.
const aim42WithoutImports = aim42Css.replace(/@import url\(.*\);/g, '')

const scopedAsciidocCss = scope(aim42WithoutImports, '.aim42-container')

fs.writeFileSync('src/features/aim42/aim42.css', scopedAsciidocCss, 'utf8')

// We also need to copy over the images of aim42.
copyfiles(
  [
    'node_modules/@scope42/structured-aim42/resources/images/**',
    'public/aim42'
  ],
  4,
  () => {}
)
