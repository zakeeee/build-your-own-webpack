const path = require('path')
const DemoPlugin = require('./plugins/demo-plugin')

module.exports = {
  entry: path.resolve(__dirname, './input.js'),
  output: {
    path: __dirname,
    filename: 'output.js',
  },
  module: {
    rules: [
      {
        test: /\.pop$/,
        use: [path.resolve(__dirname, './loaders/demo-loader.js')],
      },
    ],
  },
  plugins: [new DemoPlugin()],
}
