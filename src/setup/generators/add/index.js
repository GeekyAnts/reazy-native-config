var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
import { addEnv, addImport, addUse } from 'reazy-setup-helper';
import linkIOS from './_utils/linkIOS';
import linkAndroid from './_utils/linkAndroid';

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function () {
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

  writing: function () {
    const envExamplePath = this.destinationPath('.env.example');
    const iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    const androidBuildGradlePath = this.destinationPath('android/app/build.gradle');

    this.log('Installing react-native-config as a project dependency...');
    this.spawnCommandSync('npm', ['install', '--save', 'react-native-config@0.3.1']);
    this.spawnCommandSync('react-native', ['link', 'react-native-config']);
    linkIOS(iosProjPath, this.props.name);
    linkAndroid(androidBuildGradlePath);

    addImport('reazy-native-config', 'config');
    addUse('app.use(config(), \'config\')');
    addEnv('TEST_CONFIG', 'test');
    addEnv('TEST_CONFIG', 'test', envExamplePath);

  },

  end: function () {
  }
});
