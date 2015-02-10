var Promise = require('bluebird');
var HttpError = require('../errors').HttpError;
var http = Promise.promisifyAll(require('request'));

module.exports = HttpTransport;

function HttpTransport(options) {
  options = options || {};
}

HttpTransport.prototype.request = function (config) {
  config = config || {};
  config.method = config.method || 'GET';

  return http[config.method.toLowerCase() + 'Async'](config)
    .spread(function (response, body) {
      var result = {
        data: body,
        statusCode: response.statusCode,
        headers: response.headers,
        config: config
      };

      if (isSuccess(response.statusCode)) {
        return Promise.resolve(result);
      } else {
        return Promise.reject(new HttpError(body, response.statusCode, response.headers));
      }
    });
}

function isSuccess(statusCode) {
  return 200 <= statusCode && statusCode < 300;
}
