# Resourcery

A library for working with REST resources.

## Basic Usage

```
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

### actions(object)

### build()

Returns the resource. This function must be called at the end of the configuration chain.
