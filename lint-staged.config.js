/*
 * @Description: 用来对你已经 git add 的文件进行校验，所以不需要指定路径。
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-09 16:41:22
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-28 14:36:37
 */
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['prettier --write', 'stylelint --fix --allow-empty-input'],
  '*.{scss,less,styl,css,html}': ['stylelint --fix --allow-empty-input', 'prettier --write'],
  '*.md': ['prettier --write'],
}
