'use strict';

var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var transform = require('../lib/transform');

function removeService(filename, name, moduleName) {
  if (fs.existsSync(filename)) {
    var content = fs.readFileSync(filename).toString();

    content.replace('import ' + name + ' from \'' + modulename + '\';\n', '');
    content.replace('app.use(' + name + '(), \'config\');\n', '');

    fs.writeFileSync(filename, content, { encoding: 'utf8' });
  }
}

function deleteEnvFile(filename) {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
}

function unlinkIOS(filename, projName) {
  if (fs.existsSync(filename)) {
    var fileContents = fs.readFileSync(filename, { encoding: 'utf8' }).split('\n');

    fileContents.replace('INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";', '');
    fileContents.replace('INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";', '');
    fileContents.replace('INFOPLIST_PREPROCESS = YES;', '');
    fs.writeFileSync(filename, fileContents, { encoding: 'utf8' });
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}

function unlinkAndroid(filename) {
  if (fs.existsSync(filename)) {
    var fileContents = fs.readFileSync(filename, { encoding: 'utf8' }).split('\n');

    fileContents.replace('apply from: project(\':react-native-config\').projectDir.getPath() + "/dotenv.gradle"', '');

    fs.writeFileSync(filename, fileContents, { encoding: 'utf8' });
  } else {
    console.log('Make sure that the Android project exists');
  }
}

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
    var appJsPath = this.destinationPath('src/app.js');
    var envPath = this.destinationPath('.env');
    var envExamplePath = this.destinationPath('.env.example');
    var iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    var androidBuildGradlePath = this.destinationPath('android/app/build.gradle');

    var self = this;
    // this.npmInstall(['reazy-native-config@0.0.3'], {save: true}, function () {
    self.spawnCommandSync('react-native', ['unlink', 'react-native-config']);
    unlinkIOS(iosProjPath, self.props.name);
    unlinkAndroid(androidBuildGradlePath);
    // });

    // Automatically import the new service into services/index.js and initialize it.
    removeService(appJsPath, 'reazyNativeConfig', 'reazy-native-config');
    deleteEnvFile(envPath);
    deleteEnvFile(envExamplePath);
  }
});