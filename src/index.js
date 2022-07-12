const path = require('path')
const Compiler = require('./compiler')

let configPath = path.resolve(process.cwd(), './webpack.config.js')

const idx = process.argv.indexOf('--config')
if (idx > 0 && process.argv[idx + 1]) {
  configPath = path.resolve(process.cwd(), process.argv[idx + 1])
}

const config = require(configPath)

const compiler = new Compiler(config)

compiler.run()
