var map = require('lodash.map');
var compact = require('lodash.compact');
var isFunction = require('lodash.isfunction');

exports.attachDeps = function(params, options) {
  params = params || {};
  options = options || {};
  options.overwrite = options.overwrite || false;

  var dependencies = isFunction(this.dependencies) ?
    this.dependencies() :
    this.dependencies;

  var errors = compact(map(dependencies, function(val, key) {
    var dep = key;
    var msg = val;

    if (typeof key === 'number') {
      dep = val;
      msg = '`' + val + '`';
    }

    if (params[dep]) {
      if (options.overwrite === false && this[dep]) {
        return;
      }
      this[dep] = params[dep];
    } else {
      return msg;
    }
  }, this));

  if (errors.length > 0) {
    throw new Error([
      'Missing required dependencies:',
      errors.join(', ')
    ].join(' '));
  }
};

