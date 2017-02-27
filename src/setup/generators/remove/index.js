var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
import { removeImport, removeUse } from 'reazy-setup-helper';
import unlinkIOS from './_utils/unlinkIOS';
import unlinkAndroid from './_utils/unlinkAndroid';

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
    const iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    const androidBuildGradlePath = this.destinationPath('android/app/build.gradle');


    this.spawnCommandSync('react-native', ['unlink', 'react-native-config']);
    this.log('Uninstalling react-native-config...');
    this.spawnCommandSync('npm', ['uninstall', '--save', 'react-native-config']);
    unlinkIOS(iosProjPath, this.props.name);
    unlinkAndroid(androidBuildGradlePath);

    removeUse('reazy-native-config');
    removeImport('reazy-native-config');
  },

  end: function () {
  }
});
