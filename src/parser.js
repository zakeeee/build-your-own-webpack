const babelParser = require('@babel/parser')
const babelTraverse = require('@babel/traverse').default
const babel = require('@babel/core')
const fs = require('fs')
const path = require('path')

function parse(fileName, config) {
  let source = fs.readFileSync(fileName, 'utf-8')

  // 使用 loaders 处理文件
  if (config && config.module && config.module.rules) {
    const { rules } = config.module
    for (const rule of rules) {
      if (rule.test.test(fileName)) {
        for (let i = rule.use.length - 1; i > -1; i--) {
          const loader = require(rule.use[i])
          source = loader(source)
        }
      }
    }
  }

  const ast = babelParser.parse(source, {
    sourceType: 'module',
  })

  const dependencies = []
  const dirPath = path.dirname(fileName)
  // 遍历ast，找到 require('xxx') 调用以及 import 语句，将其导入内容加入到依赖
  babelTraverse(ast, {
    CallExpression(nodePath) {
      if (nodePath.node.callee.name === 'require') {
        const moduleFileName = path.resolve(dirPath, nodePath.node.arguments[0].value).replace(/\\/g, '/')
        nodePath.node.arguments[0].value = moduleFileName
        dependencies.push(moduleFileName)
      }
    },
    ImportDeclaration(nodePath) {
      const moduleFileName = path.resolve(dirPath, nodePath.node.source.value).replace(/\\/g, '/')
      nodePath.node.source.value = moduleFileName
      dependencies.push(moduleFileName)
    },
  })

  const code = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  })

  return { code, dependencies }
}

module.exports = {
  parse,
}
