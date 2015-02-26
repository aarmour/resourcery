var _ = require('../util');
var Promise = require('bluebird');
var MockHttpExpectation = require('./mock-http-expectation');
var HttpError = require('../errors').HttpError;

module.exports = MockHttpTransport;

/**
 * [MockHttpTransport description]
 * @param {[type]} options [description]
 */

function MockHttpTransport(options) {
  options = options || {};

  this.definitions = [];
  this.responses = [];
}

/**
 * [when description]
 * @param  {[type]} method  [description]
 * @param  {[type]} url     [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */

MockHttpTransport.prototype.when = function (method, url, data, headers) {
  var definition = new MockHttpExpectation(method, url, data, headers);
  var chain = {
    respond: function (statusCode, data, headers) {
      definition.response = createResponse(statusCode, data, headers);
      return chain;
    },
    delay: function (interval) {
      definition.delay = interval;
      return chain;
    }
  };

  this.definitions.push(definition);

  return chain;
};

/**
 * [request description]
 * @param  {[type]}   config   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */

MockHttpTransport.prototype.request = function (config) {
  if (_.isString(config)) config = {uri: config};

  var method = config.method || 'GET';
  var url = config.uri;
  var data = config.body;
  var headers = config.headers || {};

  var i = -1, definition;
  while ((definition = this.definitions[++i])) {
    if (definition.match(method, url, data, headers)) {
      if (definition.response) {
        return new Promise(function (resolve, reject) {

          function resolveOrRejectPromise(response) {
            isSuccess(response.statusCode) ? resolve(response) : reject(new HttpError(response.data, response.statusCode, response.headers));
          }

          if (definition.delay) {
            setTimeout(function () {
              resolveOrRejectPromise(definition.response());
            }, definition.delay);
          } else {
            resolveOrRejectPromise(definition.response());
          }
        });
      } else {
        throw new Error('No response defined');
      }
    }
  }

  throw new Error('No response defined');
};

function createResponse(statusCode, data, headers) {
  if (!_.isNumber(statusCode)) {
    headers = data;
    data = statusCode;
    statusCode = 200;
  }

  return function () {
    return {
      statusCode: statusCode,
      data: _.isFunction(data) ? data() : data,
      headers: _.isFunction(headers) ? headers() : headers
    };
  };
}

function isSuccess(statusCode) {
  return 200 <= statusCode && statusCode < 300;
}
