const path = require('path')
const parser = require('./parser')
const fs = require('fs')
const { SyncHook } = require('tapable')

class Compiler {
  constructor(config) {
    this.config = config
    this.execPath = process.cwd()
    this.modules = new Map()
    this.hooks = {
      emit: new SyncHook(),
      afterEmit: new SyncHook(),
    }

    // 注册插件
    const { plugins } = config
    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        plugin.apply(this)
      }
    }
  }

  run() {
    this.buildModules(path.resolve(this.execPath, this.config.entry))
    this.hooks.emit.call()
    this.emitFiles()
    this.hooks.afterEmit.call()
  }

  buildModules(fileName) {
    const key = path.resolve(this.execPath, fileName).replace(/\\/g, '/')
    if (this.modules.has(key)) {
      return
    }

    const { code, dependencies } = parser.parse(fileName, this.config)
    this.modules.set(key, {
      code,
      dependencies,
    })

    dependencies.forEach((dependency) => {
      this.buildModules(path.resolve(this.execPath, dependency))
    })
  }

  emitFiles() {
    const outputFilePath = path.resolve(this.config.output.path, this.config.output.filename)
    let modules = ''
    this.modules.forEach((mod, key) => {
      modules += `// =======================================================
"${key}": function (require, module, exports) {
${mod.code.code}
},\n`
    })

    const bundle = `(function(modules) {
var installedModules = {};
function require(filename) {
  if (installedModules[filename]) {
    return installedModules[filename].exports;
  }
  var fn = modules[filename];
  var module = installedModules[filename] = {
    exports: {},
  };
  fn(require, module, module.exports);
  return module.exports;
}
require("${path.resolve(this.execPath, this.config.entry).replace(/\\/g, '/')}");
})({
${modules}
})`

    fs.writeFileSync(outputFilePath, bundle, 'utf-8')
  }
}

module.exports = Compiler
