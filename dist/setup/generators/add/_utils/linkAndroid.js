'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkAndroid;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkAndroid(filename) {
  if (_fs2.default.existsSync(filename)) {
    var fileContents = _fs2.default.readFileSync(filename, { encoding: 'utf8' }).split('\n');
    var lineNumber = 0;
    fileContents.filter(function (word, index) {
      if (word.indexOf('apply plugin: "com.android.application"') !== -1) {
        lineNumber = index;
        return true;
      }
      return false;
    });
    fileContents.splice(lineNumber + 1, 0, 'apply from: project(\':react-native-config\').projectDir.getPath() + "/dotenv.gradle"');

    fileContents = fileContents.join('\n');
    _fs2.default.writeFileSync(filename, fileContents, { encoding: 'utf8' });
  } else {
    console.log('Make sure that the Android project exists');
  }
}