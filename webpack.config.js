const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack')

const path = require('path')
const outputPath = 'web/assets/js'
const isDev = process.env.NODE_ENV === 'development'
const filename = isDev ? 'app-dev.js' : 'app.js'

module.exports = {
  entry: './source/vue/app.js',
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: filename,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'source/vue'),
    }
  },
  cache: isDev ? false : true,
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      '__VUE_OPTIONS_API__': true,
      '__VUE_PROD_DEVTOOLS__': false,
      '__VUE_I18N_FULL_INSTALL__': true,
      '__VUE_I18N_LEGACY_API__': true,
      '__INTLIFY_PROD_DEVTOOLS__': true,
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
    }),
  ]
}
