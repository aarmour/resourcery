var _ = require('./util');
var parser = require('uri-template');

module.exports = Resource;

function Resource(uri, options) {
  if (!(this instanceof Resource)) return new Resource(uri, options);

  var params = {};

  if (typeof options === 'object') {
    _.extend(params, options, {uri: uri});
  } else if (typeof uri === 'string') {
    _.extend(params, {uri: uri});
  } else {
    _.extend(params, uri);
  }

  if (!params.uri) throw new Error('uri is required.');

  this.uriTemplate = parser.parse(params.uri);
}

Resource.prototype.expandUri = function (data) {
  return this.uriTemplate.expand(data);
};
