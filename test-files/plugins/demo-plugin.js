class DemoPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('emit', () => {
      console.log('====== emit')
    })

    compiler.hooks.afterEmit.tap('afterEmit', () => {
      console.log('====== afterEmit')
    })
  }
}

module.exports = DemoPlugin
