'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unlinkAndroid;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unlinkAndroid(filename) {
  if (_fs2.default.existsSync(filename)) {
    var fileContents = _fs2.default.readFileSync(filename, { encoding: 'utf8' });

    fileContents = fileContents.replace('apply from: project(\':react-native-config\').projectDir.getPath() + "/dotenv.gradle"', '');

    _fs2.default.writeFileSync(filename, fileContents, { encoding: 'utf8' });
  } else {
    console.log('Make sure that the Android project exists');
  }
}