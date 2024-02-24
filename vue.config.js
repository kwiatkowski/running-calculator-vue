const webpack = require('webpack')
const path = require('path')

// process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  publicPath: '/training/web/',
  lintOnSave: false,
  outputDir: 'web',
  devServer: {
    port: 8080,
  },
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
      }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~@/scss/global";',
        sassOptions: {
          includePaths: ["./src/scss"]
        }
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
    },
  }
}
