var Promise = require('bluebird');
var test = require('tape');
var sinon = require('sinon');
var HttpError = require('../../').HttpError;
var MockHttpTransport = require('../../lib/transport').MockHttpTransport;

test('when(method, url, data, headers): should register a new definition', function (t) {
  t.plan(1);

  var transport = new MockHttpTransport();

  transport.when('GET', 'http://example.org');

  t.equal(transport.definitions.length, 1);
});

test('when(method, url, data, headers): should chain', function (t) {
  t.plan(2);

  var transport = new MockHttpTransport();
  var chain = transport.when('GET', 'http://example.org');

  t.equal(typeof chain.respond, 'function');
  t.equal(typeof chain.respond().respond, 'function');
});

test('when(method, url, data, headers): should add a new definition', function (t) {
  t.plan(1);

  var transport = new MockHttpTransport();

  transport.when('GET', 'http://example.org');

  t.equal(transport.definitions.length, 1);
});

test('respond(statusCode, data, headers): should configure the response', function (t) {
  t.plan(19);

  var transport = new MockHttpTransport();

  // Explicit status
  transport.when('GET', '/withstatus')
    .respond(201, {message: 'created'}, {'X-Foo': 'foo'});

  transport.request('/withstatus')
    .then(function (result) {
      t.equal(result.statusCode, 201);
      t.deepEqual(result.data, {message: 'created'});
      t.deepEqual(result.headers, {'X-Foo': 'foo'});
    });

  // No status
  transport.when('GET', '/nostatus')
    .respond({message: 'ok'}, {'X-Foo': 'foo'});

  transport.request('/nostatus')
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'ok'});
      t.deepEqual(result.headers, {'X-Foo': 'foo'});
    });

  // With data
  transport.when('PUT', '/data', {foo: 'bar'})
    .respond(200, {message: 'updated'});

  transport.request({method: 'PUT', uri: '/data', body: {foo: 'bar'}})
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'updated'});
    });

  t.throws(transport.request.bind(transport, {method: 'PUT', uri: '/data'}), /no response defined/i, 'No response defined');

  // With headers
  transport.when('GET', '/headers', null, {'X-Foo': 'foo'})
    .respond(200, {message: 'ok'});

  transport.request({method: 'GET', uri: '/headers', headers: {'X-Foo': 'foo'}})
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'ok'});
    });

  t.throws(transport.request.bind(transport, {method: 'GET', uri: '/headers'}), /no response defined/i, 'No response defined');

  // Format response data using a function
  transport.when('GET', '/response/data/fn')
    .respond(200, function () { return {message: 'ok'}; });

  transport.request({method: 'GET', uri: '/response/data/fn'})
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'ok'});
    });

  // Format response headers using a function
  transport.when('GET', '/response/headers/fn')
    .respond(200, null, function () { return {'X-Foo': 'foo'}; });

  transport.request({method: 'GET', uri: '/response/headers/fn'})
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.headers, {'X-Foo': 'foo'});
    });

  // Change a response
  transport.when('GET', '/changeresponse')
    .respond(200, {message: 'original'})
    .respond(202, {message: 'updated'});

  transport.request('/changeresponse')
    .then(function (result) {
      t.equal(result.statusCode, 202);
      t.deepEqual(result.data, {message: 'updated'});
    });

  // Non-success status code
  transport.when('GET', '/500')
    .respond(500, {message: 'error'});

  transport.request('/500')
    .catch(function (error) {
      t.ok(error instanceof HttpError);
    });
});

test('passThrough()', function (t) {
  t.plan(3);

  var mockDelegateTransport = {
    request: function (config) {
      return Promise.resolve(config);
    }
  };

  var transport = new MockHttpTransport({transport: mockDelegateTransport});

  // Passes through
  transport.when('GET', '/passthrough')
    .passThrough();

  transport.request('/passthrough')
    .then(function (result) {
      t.equal(result.uri, '/passthrough');
    });

  // Overrides response
  transport.when('GET', '/passthrough/override')
    .respond(200)
    .passThrough();

  transport.request('/passthrough/override')
    .then(function (result) {
      t.equal(result.uri, '/passthrough/override');
    });

  // Response overrides passthrough
  transport.when('GET', '/response')
    .passThrough()
    .respond(200);

  transport.request('/response')
    .then(function (result) {
      t.equal(result.statusCode, 200);
    });
});

test('delayed response', function (t) {
  t.plan(1);

  var transport = new MockHttpTransport();
  var clock = sinon.useFakeTimers();

  transport.when('GET', '/delay')
    .delay(10000)
    .respond(200, function () { return {now: new Date().getTime() }; });

  transport.request('/delay')
    .then(function (result) {
      t.equal(result.data.now, 10000);
    });

  clock.tick(10001);
  clock.restore();
});
