var test = require('tape');
var resourcery = require('../../');

test('Resourcery.defaults(options)', function (t) {
  t.plan(1);

  var r = resourcery.defaults({transport: {request: 'fake'}});
  var resource = r.resource('http://example.org');

  t.deepEqual(resource.transport, {request: 'fake'});
});
