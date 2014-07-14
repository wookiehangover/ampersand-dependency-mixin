var test = require('tape');
var dependency = require('../ampersand-dependency-mixin');

function factory(options) {
  options = options || {};

  var Constr = function(options) {
    this.initialize(options);
  };

  Constr.prototype.initialize = options.initialize || function(options) {
    this.attachDeps(options);
  };

  Constr.prototype.attachDeps = dependency.attachDeps;
  Constr.prototype.dependencies = options.dependencies;

  return Constr;
}

test('attachDeps', function(t) {
  t.plan(7);

  var NoDeps = factory();
  t.doesNotThrow(function() {
    new NoDeps();
  });

  var SingleDep = factory({
    dependencies: ['model']
  });
  t.throws(
    function() {
      new SingleDep();
    },
    'Missing required dependencies: `model`',
    'should throw an error'
  );

  var singleDep = new SingleDep({ model: 'foo' });
  t.equal(singleDep.model, 'foo', 'attaches the dep');

  var MultipleDeps = factory({
    dependencies: ['model', 'config']
  });
  t.throws(
    function() {
      new MultipleDeps();
    },
    'Missing required dependencies: `model`, `config`',
    'should throw an error message with the missing deps'
  );
  t.throws(
    function() {
      new MultipleDeps({ model: 'foo' });
    },
    'Missing required dependencies: `config`',
    'should throw an error message with the missing deps (partial message)'
  );

  var multipleDeps = new MultipleDeps({
    model: 'foo',
    config: 'bar'
  });
  t.equal(multipleDeps.model, 'foo');
  t.equal(multipleDeps.config, 'bar');
});

test('attachDeps: custom error messages', function(t) {
  t.plan(5);

  var CustomMsg = factory({
    dependencies: {
      model: 'User Model'
    }
  });
  t.throws(
    function() {
      new CustomMsg();
    },
    'Missing required dependencies: User Model',
    'should throw an error with a custom message'
  );

  var customMsg = new CustomMsg({
    model: 'foo'
  });
  t.equal(customMsg.model, 'foo', 'attaches the dep');

  var MultiCustomMsg = factory({
    dependencies: {
      model: 'User Model',
      config: 'App Config'
    }
  });
  t.throws(
    function() {
      new MultiCustomMsg();
    },
    'Missing required dependencies: User Model, App Config',
    'should throw a custom error message'
  );

  var multiCustomMsg = new MultiCustomMsg({
    model: 'foo',
    config: 'bar'
  });
  t.equal(multiCustomMsg.model, 'foo');
  t.equal(multiCustomMsg.config, 'bar');
});

test('attachDeps: dependencies function', function(t) {
  t.plan(2);

  var FnSingleDep = factory({
    dependencies: function() {
      return ['model'];
    }
  });
  t.throws(
    function() {
      new FnSingleDep();
    },
    'Missing required dependencies: `model`',
    'should throw an error'
  );

  var fnSingleDep = new FnSingleDep({
    model: 'foo'
  });
  t.equal(fnSingleDep.model, 'foo', 'attaches the dep');
});

test('attachDeps: pre-existing values', function(t) {
  t.plan(2);

  var DoesntClobber = factory({
    dependencies: ['model']
  });
  DoesntClobber.prototype.model = 'bar';

  var doesntClobber = new DoesntClobber({
    model: 'foo'
  });
  t.equal(doesntClobber.model, 'bar', 'preserves previous values');

  var Clobbers = factory({
    dependencies: ['model'],
    initialize: function(options) {
      this.attachDeps(options, { overwrite: true });
    }
  });
  Clobbers.prototype.model = 'bar';

  var clobbers = new Clobbers({
    model: 'foo'
  });
  t.equal(clobbers.model, 'foo', 'clobbers the original value when `overwrite === true`');
});
