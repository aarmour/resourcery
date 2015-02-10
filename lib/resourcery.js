var ResourceFactory = require('./resource-factory');

exports.resource = function (uri, options) {
  return new ResourceFactory(uri, options);
}
