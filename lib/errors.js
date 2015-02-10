var util = require('util');

exports.HttpError = HttpError;

function HttpError(body, statusCode, headers) {
  Error.call(this);

  this.body = body;
  this.statusCode = statusCode;
  this.headers = headers;
}

util.inherits(HttpError, Error);
