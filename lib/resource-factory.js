var _ = require('lodash');
var Promise = require('bluebird');
var format = require('util').format;
var HttpTransport = require('./transport/http');
var Resource = require('./resource');

module.exports = ResourceFactory;

function ResourceFactory(uri, options) {
  options = options || {};

  this.options = options;
  this.uri = uri;
  this.transport = options.transport || new HttpTransport();
}

ResourceFactory.prototype.actions = function (actions) {
  this.actions = actions || {};

  return this;
};

ResourceFactory.prototype.build = function () {
  return resourceFactory.apply(this);
};

function resourceFactory() {
  var resource = new Resource(this.uri, this.options);
  var fallbackFn = this.fallbackFn;
  var transport = this.transport;

  _.forIn(this.actions, function (action, name) {
    action.method = action.method || 'GET';

    var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

    resource[name] = function (a1, a2, a3, a4) {
      var params = {}, data, options, callback;

      switch (arguments.length) {
        case 4:
          params = a1;
          data = a2;
          options = a3;
          callback = a4;
          break;
        case 3:
          params = a1;

          if (hasBody) {
            data = a2;
            if (typeof a3 === 'function') {
              callback = a3;
            } else {
              options = a3;
            }
          } else {
            options = a2;
            callback = a3;
          }
          break;
        case 2:
          if (hasBody) {
            if (_.isFunction(a2)) {
              data = a1;
              callback = a2;
            } else {
              params = a1;
              data = a2;
            }
          } else {
            if (_.isFunction(a2)) {
              params = a1;
              callback = a2;
            } else {
              params = a1;
              options = a2;
            }
          }
          break;
        case 1:
          if (_.isFunction(a1)) {
            callback = a1;
          } else if (hasBody) {
            data = a1;
          } else {
            params = a1;
          }
        case 0:
          break;
        default:
          throw new TypeError(format('Expected up to 4 arguments [params, data, callback], got %d arguments.', arguments.length));
      }

      var httpConfig = {};

      _.forIn(action, function (value, key) {
        if (key === 'params') return;

        httpConfig[key] = value;
      });

      params = _.extend({}, action.params, params);
      httpConfig.uri = resource.expandUri(params);
      httpConfig.json = true;

      if (hasBody) httpConfig.body = data;

      _.extend(httpConfig, options);

      var promise = transport.request(httpConfig);

      if (callback) {
        promise
          .then(callback.bind(null, null))
          .catch(callback);
      } else {
        return promise;
      }
    };
  }, this);

  return resource;
}
