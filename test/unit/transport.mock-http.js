var test = require('tape');
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
  t.plan(14);

  var transport = new MockHttpTransport();

  // Explicit status
  transport.when('GET', 'http://example.org/withstatus')
    .respond(201, {message: 'created'}, {'X-Foo': 'foo'});

  transport.request('http://example.org/withstatus')
    .then(function (result) {
      t.equal(result.statusCode, 201);
      t.deepEqual(result.data, {message: 'created'});
      t.deepEqual(result.headers, {'X-Foo': 'foo'});
    });

  // No status
  transport.when('GET', 'http://example.org/nostatus')
    .respond({message: 'ok'}, {'X-Foo': 'foo'});

  transport.request('http://example.org/nostatus')
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'ok'});
      t.deepEqual(result.headers, {'X-Foo': 'foo'});
    });

  // With body
  transport.when('PUT', 'http://example.org/data', {foo: 'bar'})
    .respond(200, {message: 'updated'});

  transport.request({method: 'PUT', uri: 'http://example.org/data', body: {foo: 'bar'}})
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'updated'});
    });

  t.throws(transport.request.bind(transport, {method: 'PUT', uri: 'http://example.org/data'}), /no response defined/i, 'No response defined');

  // With headers
  transport.when('GET', 'http://example.org/headers', null, {'X-Foo': 'foo'})
    .respond(200, {message: 'ok'});

  transport.request({method: 'GET', uri: 'http://example.org/headers', headers: {'X-Foo': 'foo'}})
    .then(function (result) {
      t.equal(result.statusCode, 200);
      t.deepEqual(result.data, {message: 'ok'});
    });

  t.throws(transport.request.bind(transport, {method: 'GET', uri: 'http://example.org/headers'}), /no response defined/i, 'No response defined');

  // Change a response
  transport.when('GET', 'http://example.org/changeresponse')
    .respond(200, {message: 'original'})
    .respond(500, {message: 'updated'});

  transport.request('http://example.org/changeresponse')
    .then(function (result) {
      t.equal(result.statusCode, 500);
      t.deepEqual(result.data, {message: 'updated'});
    });
});
