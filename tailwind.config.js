/*
 * @Descripttion:
 * @version:
 * @Author: 张一
 * @Date: 2020-08-26 08:45:38
 * @LastEditors: 张一
 * @LastEditTime: 2020-08-26 08:53:28
 */
const plugin = require('tailwindcss/plugin');
const theme = require('./src/styles/tailwind/theme');
const variants = require('./src/styles/tailwind/variants');

const errPage = require('./src/styles/tailwind/components/errPage');
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [],
  target: 'relaxed',
  prefix: '',
  important: false,
  separator: ':',
  theme,
  variants,
  corePlugins: {},
  plugins: [
    plugin(function({ addComponents }) {
      addComponents(errPage);
    }),
  ],
};
