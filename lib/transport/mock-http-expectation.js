var _ = require('../util');

module.exports = MockHttpExpectation;

/**
 * [MockHttpExpectation description]
 * @param {string} method
 * @param {string|RegExp|function} url
 * @param {string|object|RegExp|function} data
 * @param {object|function} headers
 */

function MockHttpExpectation(method, url, data, headers) {
  this.method = method;
  this.url = url;
  this.data = data;
  this.headers = headers;
}

/**
 * [match description]
 * @param {string} method
 * @param {string} url
 * @param {string|object} data
 * @param {object} headers
 * @return {boolean}
 */

MockHttpExpectation.prototype.match = function (method, url, data, headers) {
  if (this.method !== method) return false;
  if (!this.matchUrl(url)) return false;
  if (!this.matchData(data)) return false;
  if (!this.matchHeaders(headers)) return false;
  return true;
};

/**
 * [matchUrl description]
 * @param {string} url
 * @return {boolean}
 */

MockHttpExpectation.prototype.matchUrl = function (url) {
  if (!this.url) return true;
  if (_.isFunction(this.url.test)) return this.url.test(url);
  if (_.isFunction(this.url)) return this.url(url);
  return this.url === url;
};

/**
 * [matchHeaders description]
 * @param {object} headers
 * @return {boolean}
 */

MockHttpExpectation.prototype.matchHeaders = function (headers) {
  if (!this.headers) return true;
  if (_.isFunction(this.headers)) return this.headers(headers);
  return _.equals(this.headers, headers);
};

/**
 * [matchData description]
 * @param {string|object} data
 * @return {boolean}
 */

MockHttpExpectation.prototype.matchData = function (data) {
  if (this.data === null || _.isUndefined(this.data)) return true;
  if (_.isFunction(this.data.test)) return this.data.test(data);
  if (_.isFunction(this.data)) return this.data(data);
  if (!_.isString(this.data)) return _.equals(this.data, data);
  return this.data === data;
};
