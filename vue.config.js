const GenerateJsonFile = require('generate-json-file-webpack-plugin')
const WebpackPreBuildPlugin = require('pre-build-webpack')
const fs = require('fs')
const moment = require('moment')
const path = './src/build.info.json'
const buildTime = moment().toISOString()

if (fs.existsSync(path)) {
  fs.unlinkSync(path)
}

module.exports = {
  lintOnSave: true,
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [
      new GenerateJsonFile({
        filename: 'manifest.json',
        value: {
          buildTime
        }
      }),
      new WebpackPreBuildPlugin(stats => {
        if (!fs.existsSync(path)) {
          fs.writeFileSync(
            path,
            JSON.stringify({
              buildTime
            })
          )
        }
      })
    ]
  }
}
