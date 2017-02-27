'use strict';

var _reazySetupHelper = require('reazy-setup-helper');

var _linkIOS = require('./_utils/linkIOS');

var _linkIOS2 = _interopRequireDefault(_linkIOS);

var _linkAndroid = require('./_utils/linkAndroid');

var _linkAndroid2 = _interopRequireDefault(_linkAndroid);

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
    var envExamplePath = this.destinationPath('.env.example');
    var iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    var androidBuildGradlePath = this.destinationPath('android/app/build.gradle');

    this.log('Installing react-native-config as a project dependency...');
    this.spawnCommandSync('npm', ['install', '--save', 'react-native-config@0.3.1']);
    this.spawnCommandSync('react-native', ['link', 'react-native-config']);
    (0, _linkIOS2.default)(iosProjPath, this.props.name);
    (0, _linkAndroid2.default)(androidBuildGradlePath);

    (0, _reazySetupHelper.addImport)('reazy-native-config', 'config');
    (0, _reazySetupHelper.addUse)('app.use(config(), \'config\')');
    (0, _reazySetupHelper.addEnv)('TEST_CONFIG', 'test');
    (0, _reazySetupHelper.addEnv)('TEST_CONFIG', 'test', envExamplePath);
  },

  end: function end() {}
});