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

    resource[name] = function (a1, a2, a3) {
      var params = {}, data, callback;

      switch (arguments.length) {
        case 3:
          params = a1;
          data = a2;
          callback = a3;
        case 2:
          if (_.isFunction(a2)) {
            callback = a2;

            if (hasBody) {
              data = a1;
            } else {
              params = a1;
            }
          } else {
            params = a1;
            data = a2;
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
          throw new TypeError(format('Expected up to 3 arguments [params, data, callback], got %d arguments.', arguments.length));
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
