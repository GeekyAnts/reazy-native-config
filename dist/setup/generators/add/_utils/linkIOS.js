'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkIOS;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkIOS(filename, projName) {
  if (_fs2.default.existsSync(filename)) {
    var fileContents = _fs2.default.readFileSync(filename, { encoding: 'utf8' }).split('\n');
    var lineNumbers = [];
    fileContents.filter(function (word, index) {
      if (word.indexOf('INFOPLIST_FILE = ' + projName + '/Info.plist;') !== -1) {
        lineNumbers.push(index);
        return true;
      }
      return false;
    });
    // console.log('lineNumbers', lineNumbers);
    lineNumbers.forEach(function (lineNumber) {
      fileContents.splice(lineNumber + 1, 0, '\n                                  INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";\n                                  INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";\n                                  INFOPLIST_PREPROCESS = YES;');
    });

    fileContents = fileContents.join('\n');
    _fs2.default.writeFileSync(filename, fileContents, { encoding: 'utf8' });
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}