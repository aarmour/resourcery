var test = require('tape');
var MockHttpExpectation = require('../../lib/transport/mock-http-expectation');

test('match(method, url, data, header', function (t) {
  t.plan(5);

  var expectation = new MockHttpExpectation('POST', 'http://example.org', {foo: 'bar'}, {'X-Foo': 'bar'});

  t.equal(expectation.match('GET'), false, 'returns false when method does not match');
  t.equal(expectation.match('POST', 'http://not.example.org'), false, 'returns false when url does not match');
  t.equal(expectation.match('POST', 'http://example.org', {foo: 'baz'}), false, 'returns false when data does not match');
  t.equal(expectation.match('POST', 'http://example.org', {foo: 'bar'}, {'X-Foo': 'baz'}), false, 'returns false when headers do not match');
  t.equal(expectation.match('POST', 'http://example.org', {foo: 'bar'}, {'X-Foo': 'bar'}), true, 'returns true if match');
});

test('matchUrl(url)', function (t) {
  t.plan(5);

  var expectation;

  expectation = new MockHttpExpectation();
  t.equal(expectation.matchUrl(), true, 'returns true when expected url is undefined');

  expectation = new MockHttpExpectation('POST', /example\.org/);
  t.equal(expectation.matchUrl('https://example.org'), true, 'returns true when expected url is a regex and matches');
  t.equal(expectation.matchUrl('https://localhost'), false, 'returns false when expected url is a regex and does not match');

  expectation = new MockHttpExpectation('POST', function (url) { return url === 'http://example.org'; });
  t.equal(expectation.matchUrl('http://example.org'), true, 'returns true when expected url is a function');

  expectation = new MockHttpExpectation('POST', 'http://example.org');
  t.equal(expectation.matchUrl('http://example.org'), true, 'returns true when expected url is a string');
});

test('matchHeaders(headers)', function (t) {
  t.plan(3);

  var expectation;

  expectation = new MockHttpExpectation();
  t.equal(expectation.matchHeaders(), true, 'returns true when expected headers is undefined');

  expectation = new MockHttpExpectation(undefined, undefined, undefined, function (headers) { return headers['X-Foo'] === 'bar'; });
  t.equal(expectation.matchHeaders({'X-Foo': 'bar'}), true, 'returns true when expected headers is a function');

  expectation = new MockHttpExpectation(undefined, undefined, undefined, {'X-Foo': 'bar'});
  t.equal(expectation.matchHeaders({'X-Foo': 'bar'}), true, 'returns true when expected headers is an object');
});

test('matchData(data)', function (t) {
  t.plan(6);

  var expectation;

  expectation = new MockHttpExpectation();
  t.equal(expectation.matchData(), true, 'returns true when expected data is undefined');

  expectation = new MockHttpExpectation(undefined, undefined, /foo/);
  t.equal(expectation.matchData('foobar'), true, 'returns true when expected data is a regex and matches');
  t.equal(expectation.matchData('baz'), false, 'returns false when expected data is a regex and does not match');

  expectation = new MockHttpExpectation(undefined, undefined, function (data) { return data === 'foo'; });
  t.equal(expectation.matchData('foo'), true, 'returns true when expected data is a function');

  expectation = new MockHttpExpectation(undefined, undefined, {foo: 'bar'});
  t.equal(expectation.matchData({foo: 'bar'}), true, 'returns true when expected data is an object');

  expectation = new MockHttpExpectation(undefined, undefined, 'foo');
  t.equal(expectation.matchData('foo'), true, 'returns true when expected data is a string');
});
