var test = require('tape');
var resourcery = require('../..');

test('ResourceFactory: should add the actions as methods', function (t) {
  t.plan(2);

  var actions = {
    get: {method: 'GET'},
    save: {method: 'POST'}
  };

  var resource = resourcery
    .resource('http://example.org')
    .actions(actions)
    .build();

  t.equal(typeof resource.get, 'function', 'has get method');
  t.equal(typeof resource.save, 'function', 'has save method');
});
