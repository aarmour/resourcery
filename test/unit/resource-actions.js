var test = require('tape');
var Promise = require('bluebird');
var resourcery = require('../..');

test('resource[action](): should throw if there are too many arguments', function (t) {
  t.plan(1);

  var resource = resourcery
    .resource('http://example.org')
    .actions({get: {method: 'GET'}})
    .build();

  t.throws(function () { resource.get(1,2,3,4); }, /expected up to 3 arguments/i);
});

test('resource[action](): should use the configured transport', function (t) {
  t.plan(1);

  var mockTransport = {
    request: function (config) {
      t.equal(config.method, 'GET', 'http method is GET');
    }
  };

  var resource = resourcery
    .resource('http://example.org', {transport: mockTransport})
    .actions({get: {method: 'GET'}})
    .build();

  resource.get();
});

test('resource[action](): should call the callback', function (t) {
  t.plan(6);

  var mockTransport = {
    request: function () {
      return Promise.resolve(42);
    }
  };

  var resource = resourcery
    .resource('http://example.org', {transport: mockTransport})
    .actions({get: {method: 'GET'}})
    .build();

  // One argument
  resource.get(function (error, result) {
    t.ok(!error, 'error is null');
    t.equal(result, 42);
  });

  // Two arguments
  resource.get(null, function (error, result) {
    t.ok(!error, 'error is null');
    t.equal(result, 42);
  });

  // Three arguments
  resource.get(null, null, function (error, result) {
    t.ok(!error, 'error is null');
    t.equal(result, 42);
  })
});

test('resource[action](): should return a promise', function (t) {
  t.plan(1);

  var mockTransport = {
    request: function () {
      return Promise.resolve(42);
    }
  };

  var resource = resourcery
    .resource('http://example.org', {transport: mockTransport})
    .actions({get: {method: 'GET'}})
    .build();

  resource.get()
    .then(function (result) {
      t.equal(result, 42);
    });
});
