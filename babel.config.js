/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-03 21:39:38
 */
const plugins = []

if (process.env.UNI_OPT_TREESHAKINGNG) {
  plugins.push(
    require('@dcloudio/vue-cli-plugin-uni-optimize/packages/babel-plugin-uni-api/index.js')
  )
}

if (
  (process.env.UNI_PLATFORM === 'app-plus' && process.env.UNI_USING_V8) ||
  (process.env.UNI_PLATFORM === 'h5' && process.env.UNI_H5_BROWSER === 'builtin')
) {
  const path = require('path')

  const isWin = /^win/.test(process.platform)

  const normalizePath = (path) => (isWin ? path.replace(/\\/g, '/') : path)

  const input = normalizePath(process.env.UNI_INPUT_DIR)
  try {
    plugins.push([
      require('@dcloudio/vue-cli-plugin-hbuilderx/packages/babel-plugin-console'),
      {
        file(file) {
          file = normalizePath(file)
          if (file.indexOf(input) === 0) {
            return path.relative(input, file)
          }
          return false
        },
      },
    ])
  } catch (e) {}
}

process.UNI_LIBRARIES = process.UNI_LIBRARIES || ['@dcloudio/uni-ui']
process.UNI_LIBRARIES.forEach((libraryName) => {
  plugins.push([
    'import',
    {
      libraryName: libraryName,
      customName: (name) => {
        return `${libraryName}/lib/${name}/${name}`
      },
    },
  ])
})
module.exports = {
  presets: [
    [
      '@vue/app',
      {
        modules: 'commonjs',
        useBuiltIns: process.env.UNI_PLATFORM === 'h5' ? 'usage' : 'entry',
      },
    ],
  ],
  plugins,
}
