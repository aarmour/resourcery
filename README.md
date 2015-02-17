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

## Acknowledgements

Portions of this project were inspired by concepts from [AngularJS](https://github.com/angular/angular.js).

The MIT License
Copyright (c) 2010-2015 Google, Inc. http://angularjs.org

Refer to [angular/angular.js](https://github.com/angular/angular.js/blob/master/LICENSE) for the full copyright notice.
