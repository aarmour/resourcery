var test = require('tape');
var http = require('http');
var HttpError = require('../../lib/errors').HttpError;
var resourcery = require('../../');

var server;

test('Setup: resource', function (t) {
  server = http.createServer(function (request, response) {
    var url = require('url').parse(request.url);

    switch (url.pathname.substr(1)) {
      case '200':
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ foo: 'bar' }));
      case '500':
        response.statusCode = 500;
        response.end();
    }
  });

  server.listen(8000, '127.0.0.1', t.end);
});

test('callback: success', function (t) {
  t.plan(2);

  var resource = resourcery.resource('http://127.0.0.1:8000/200')
    .actions({ get: { method: 'GET' } })
    .build();

  resource.get(function (error, result) {
    t.equal(result.statusCode, 200, 'status code is 200');
    t.equal(result.data.foo, 'bar', 'data is returned');
  });
});

test('callback: error', function (t) {
  t.plan(2);

  var resource = resourcery.resource('http://127.0.0.1:8000/500')
    .actions({ get: { method: 'GET' } })
    .build();

  resource.get(function (error) {
    t.ok(error instanceof HttpError, 'error is an HttpError');
    t.equal(error.statusCode, 500);
  });
});

test('promise: success', function (t) {
  t.plan(2);

  var resource = resourcery.resource('http://127.0.0.1:8000/200')
    .actions({ get: { method: 'GET' } })
    .build();

  resource.get()
    .then(function (result) {
      t.equal(result.statusCode, 200, 'status code is 200');
      t.equal(result.data.foo, 'bar', 'data is returned');
    });
});

test('promise: error', function (t) {
  t.plan(2);

  var resource = resourcery.resource('http://127.0.0.1:8000/500')
    .actions({ get: { method: 'GET' } })
    .build();

  resource.get()
    .catch(function (error) {
      t.ok(error instanceof HttpError, 'error is an HttpError');
      t.equal(error.statusCode, 500);
    });
});

test('Teardown', function (t) {
  server.close();
  t.end();
});
