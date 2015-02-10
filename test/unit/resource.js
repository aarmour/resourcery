var test = require('tape');
var Resource = require('../../lib/resource');

test('Resource(uri, options): uri is required', function (t) {
  t.plan(2);

  t.throws(function () { Resource(); }, /uri is required/);
  t.throws(function () { Resource({}); }, /uri is required/);
});

test('expandUri(data): expands the uri', function (t) {
  t.plan(1);

  t.equal(Resource('http://example.org/{foo}{?bar}').expandUri({foo: 1, bar: 'baz'}), 'http://example.org/1?bar=baz');
});
