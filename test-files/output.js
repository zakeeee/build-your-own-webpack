(function(modules) {
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
require("D:/workspace/nodejs/build-your-own-webpack/test-files/input.js");
})({
// =======================================================
"D:/workspace/nodejs/build-your-own-webpack/test-files/input.js": function (require, module, exports) {
"use strict";

var _path = _interopRequireDefault(require("path"));

var _foo = require("D:/workspace/nodejs/build-your-own-webpack/test-files/foo.pop");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _foo.foo)();
console.log(_foo.bar);
console.log(_path["default"]);
},
// =======================================================
"D:/workspace/nodejs/build-your-own-webpack/test-files/foo.pop": function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = void 0;
exports.foo = foo;

function foo() {
  console.log('Hello, this is foo');
}

var bar = "bar";
exports.bar = bar;
},

})