module.exports = function demoLoader(source) {
  return source.replace(/\$FOO\$/g, 'foo').replace(/\$BAR\$/g, '"bar"')
}
