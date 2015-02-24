# Resourcery

A library for working with REST resources.

## Basic Usage

```js
var resourcery = require('resourcery');

var resource = resourcery.resource('/foo/{bar}{?baz}')
  .actions({ get: { method: 'GET', params: { bar: 'qux' } } })
  .build();

resource.get({ baz: 'foobar' })
  .then(function (barResource) {
    // ...
  })
  .catch(function (error) {
    // ...
  });
```

## API

### resource(options)

Options can be a string containing a [URI template](https://tools.ietf.org/html/rfc6570) or an object with the following properties:

##### uri

*Required*. A URI template string, as defined in [RFC6570](https://tools.ietf.org/html/rfc6570).

##### transport

*Optional*. The transport object that is responsible for making HTTP requests. It can be replaced with a mock transport for end-to-end and unit testing.

### actions(object)

### build()

This method must be called at the end of the configuration chain. Returns an object that contains the resource actions. The action methods can be invoked with the following arguments:

* GET actions: `Resource.action([parameters], [options], [callback])`
* non-GET actions: `Resource.action([parameters], data, [options], [callback])`

The `options` argument is an object containing setting overrides for the underlying transport. When overriding transport options, you must pass `null` to the preceding arguments. For example:

```js
resource.get(null, { headers: { 'X-Foo': 'foo' } });
```

## Mock Transport

A mock transport is provided for faking requests during development and for end-to-end or unit testing.

### when(method, url, [data], [headers])

Creates a new request handler with the following methods:

#### delay(interval)

Delays the response by the specified interval, in milliseconds.

#### respond([statusCode], data, [headers])

Returns a response with the provided data when a matching request is found. The `data` and `headers` arguments accept callback functions that when called return the respective values.

## Convenience Methods

### defaults(options)

Returns a wrapper around the default API. The provided options are applied to all resources created by the wrapped factory function:

```js
var fakeTransport = { request: function () { console.log('fake'); } };

var r = resourcery.defaults({ transport: fakeTransport });

var resource = r.resource('http://example.org/{userId}')
  .actions({ get: { method: 'GET' });
```

In the above example, all resources created from the wrapped object will use the fake transport.

## Acknowledgements

Portions of this project were inspired by concepts from [AngularJS](https://github.com/angular/angular.js).

The MIT License
Copyright (c) 2010-2015 Google, Inc. http://angularjs.org

Refer to [angular/angular.js](https://github.com/angular/angular.js/blob/master/LICENSE) for the full copyright notice.
