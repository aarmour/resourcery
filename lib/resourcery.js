var _ = require('./util');
var ResourceFactory = require('./resource-factory');

exports.resource = function (uri, options) {
  return new ResourceFactory(uri, options);
}

exports.defaults = function (defaultOptions) {
  return {
    resource: function (uri, options) {
      if (typeof uri === 'object') options = uri;

      return exports.resource(uri, _.extend({}, defaultOptions, options));
    }
  };
}

exports.transports = require('./transport');
