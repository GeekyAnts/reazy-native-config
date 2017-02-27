'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unlinkIOS;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unlinkIOS(filename, projName) {
  if (_fs2.default.existsSync(filename)) {
    var fileContents = _fs2.default.readFileSync(filename, { encoding: 'utf8' });
    fileContents = fileContents.replace('INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";', '');
    fileContents = fileContents.replace('INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";', '');
    fileContents = fileContents.replace('INFOPLIST_PREPROCESS = YES;', '');

    // These lines appear twice
    fileContents = fileContents.replace('INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";', '');
    fileContents = fileContents.replace('INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";', '');
    fileContents = fileContents.replace('INFOPLIST_PREPROCESS = YES;', '');
    try {
      _fs2.default.writeFileSync(filename, fileContents, { encoding: 'utf8' });
    } catch (err) {
      console.log('err', err);
    }
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}