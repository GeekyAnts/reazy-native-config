'use strict';

var _reazySetupHelper = require('reazy-setup-helper');

var _unlinkIOS = require('./_utils/unlinkIOS');

var _unlinkIOS2 = _interopRequireDefault(_unlinkIOS);

var _unlinkAndroid = require('./_utils/unlinkAndroid');

var _unlinkAndroid2 = _interopRequireDefault(_unlinkAndroid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');


module.exports = generators.Base.extend({
  constructor: function constructor() {
    generators.Base.apply(this, arguments);
  },

  initializing: function initializing() {
    // const done = this.async();

    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    if (!this.pkg || !this.pkg.name) {
      this.log('Please run this command in the root of a Reazy project');
      process.exit(1);
    }

    this.props = {
      name: this.pkg.name || process.cwd().split(path.sep).pop()
    };
  },

  writing: function writing() {
    var iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    var androidBuildGradlePath = this.destinationPath('android/app/build.gradle');

    this.spawnCommandSync('react-native', ['unlink', 'react-native-config']);
    this.log('Uninstalling react-native-config...');
    this.spawnCommandSync('npm', ['uninstall', '--save', 'react-native-config']);
    (0, _unlinkIOS2.default)(iosProjPath, this.props.name);
    (0, _unlinkAndroid2.default)(androidBuildGradlePath);

    (0, _reazySetupHelper.removeUse)('reazy-native-config');
    (0, _reazySetupHelper.removeImport)('reazy-native-config');
  },

  end: function end() {}
});