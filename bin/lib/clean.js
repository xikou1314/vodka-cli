'use strict';

function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
}

// 将options处理成对象返回
exports.cleanOptions = function (cmd) {
  var options = {};
  cmd.options.forEach(function (o) {
    var key = camelize(o.long.replace(/^--/, ''));
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      options[key] = cmd[key];
    }
  });
  return options;
};