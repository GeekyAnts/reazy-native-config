'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('reazy:configuration');

exports.default = module.exports = function (conf) {
  return function () {
    var app = this;

    if (!app) {
      return {};
    }

    if (process.env.NODE_ENV === 'production') {
      if (conf) conf = conf.production;
    } else {
      if (conf) conf = conf.default;
    }

    Object.keys(conf).forEach(function (name) {
      var value = conf[name];
      debug('Setting ' + name + ' configuration value to', value);
      app.set(name, value);
    });

    return {
      myFunc: function myFunc() {
        return 'test successful';
      }
    };
  };
};