'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactNativeConfig = require('react-native-config');

var _reactNativeConfig2 = _interopRequireDefault(_reactNativeConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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