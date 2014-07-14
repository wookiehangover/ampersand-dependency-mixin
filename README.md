# ampersand-dependency-mixin

> A mixin the provides dependency injection for [Ampersand.js](http://ampersandjs.com/).

## Usage

Install with npm:

```
$ npm install --save ampersand-dependency-mixin
```

Extend into a constructor:

```javascript
var deps = require('ampersand-dependency-mixin');
var Model = require('ampersand-model');

var MyModel = Model.extend(deps, {
  dependencies: ['config']

  initialize: function(options) {
    this.attachDeps(options)
  }
});
```

To check for dependencies on a class, declare a `dependencies` array and
call `this.attachDeps(options)`.

When `attachDeps` is run it checks the object passed to it for
keys matching any dependencies, throwing an error if they're missing and
attaching them if present.

```javascript
var model = new MyModel({ config: { ... } });
model.config
// -> { ... }

var shouldThrow = new MyModel();
// -> Error: 'Missing required dependencies: `model`'
```

### Custom Error Messages

Custom error messages can be provied by declaring `dependencies` as an
object:

```javascript
var CustomMsg = Model.extend(deps, {
  dependencies: {
    config: 'App Config'
  }
});

new CustomMsg();
// -> Error: 'Missing required dependencies: App Config'
```

### Inheriting Dependencies

Dependencies can also be provided as a function that retuns an object or
an array, which can be useful for sharing common dependencies through
inheritance.

```javascript
var BaseModel = Model.extend(deps, {
  dependencies: function() {
    return ['config']
  },
  initialize: function(options) {
    this.attachDeps(options);
  }
});

var MyModel = BaseModel.extend({
  dependencies: function() {
    var baseDeps = BaseModel.prototype.dependencies.call(this);
    return baseDeps.concat(['user'])
  }
});

new MyModel();
// -> Error: 'Missing required dependencies: `config`, `user`'
```
