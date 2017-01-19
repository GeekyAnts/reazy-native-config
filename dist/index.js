'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _reactNativeConfig = require('react-native-config');

var _reactNativeConfig2 = _interopRequireDefault(_reactNativeConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('reazy:configuration');

exports.default = module.exports = function () {
  return function (serviceName) {
    var app = this;

    if (!app) {
      return {};
    }

    app.set(serviceName, _reactNativeConfig2.default);

    return _reactNativeConfig2.default;
  };
};