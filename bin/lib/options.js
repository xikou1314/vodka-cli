'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var path = require('path');
var metadata = require('read-metadata');
var exists = require('fs').existsSync;
var getGitUser = require('./git-user');
var validateName = require('validate-npm-package-name');

/**
 * Read prompts metadata.
 *
 * @param {String} dir
 * @return {Object}
 */

module.exports = function options(name, dir) {
  var opts = getMetadata(dir);

  setDefault(opts, 'name', name); // 设置默认项目名
  setValidateName(opts); // 检验项目名称是否符合规范

  var author = getGitUser();
  if (author) {
    setDefault(opts, 'author', author);
  }

  return opts;
};

/**
 * Gets the metadata from either a meta.json or meta.js file.
 *
 * @param  {String} dir
 * @return {Object}
 */

function getMetadata(dir) {
  var json = path.join(dir, 'meta.json'); // 根据mata.json 或者mata.js 获取需要配置的信息
  var js = path.join(dir, 'meta.js');
  var opts = {};

  if (exists(json)) {
    opts = metadata.sync(json);
  } else if (exists(js)) {
    var req = require(path.resolve(js));
    if (req !== Object(req)) {
      throw new Error('meta.js needs to expose an object');
    }
    opts = req;
  }

  return opts;
}

/**
 * Set the default value for a prompt question
 *
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */

function setDefault(opts, key, val) {
  if (opts.schema) {
    opts.prompts = opts.schema;
    delete opts.schema;
  }
  var prompts = opts.prompts || (opts.prompts = {});
  if (!prompts[key] || _typeof(prompts[key]) !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': val
    };
  } else {
    prompts[key].default = val;
  }
}

function setValidateName(opts) {
  var name = opts.prompts.name;
  var customValidate = name.validate; // 保存旧的验证方法
  name.validate = function (name) {
    var its = validateName(name);
    if (!its.validForNewPackages) {
      var errors = (its.errors || []).concat(its.warnings || []);
      return 'Sorry, ' + errors.join(' and ') + '.';
    }
    if (typeof customValidate === 'function') return customValidate(name);
    return true;
  };
}