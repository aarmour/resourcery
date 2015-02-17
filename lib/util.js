var nodeUtil = require('util');

var slice = Array.prototype.slice;

exports.equals = require('equals');

exports.isString = function (value) {
  return typeof value === 'string';
};

exports.isNumber = function (value) {
  return typeof value === 'number';
};

exports.isFunction = function (value) {
  return typeof value === 'function';
};

exports.isUndefined = function (value) {
  return typeof value === 'undefined';
};

exports.isObject = function (value) {
  return value === Object(value);
};

exports.extend = function(obj) {
  if (!exports.isObject(obj)) { return obj; }

  slice.call(arguments, 1).forEach(function (source) {
    for (var prop in source) {
      obj[prop] = source[prop];
    }
  });

  return obj;
};

exports.extend(exports, nodeUtil);
