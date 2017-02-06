'use strict';

var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var transform = require('../../lib/transform');

function addService(filename, name) {
  var fileContents = fs.readFileSync(filename, { encoding: 'utf8' }).split('\n');
  var indexOfApp = fileContents.length - 1;
  fileContents.filter(function (word, index) {
    if (word.match(/reazy\(\)/g)) {
      indexOfApp = index;
      return true;
    }
    return false;
  });
  fileContents.splice(indexOfApp + 1, 0, '');
  fileContents.splice(indexOfApp + 2, 0, 'app.use(' + name + '(), \'config\');');
  fileContents = fileContents.join('\n');
  fs.writeFileSync(filename, fileContents, { encoding: 'utf8' });
}

function importService(filename, name, moduleName) {
  if (fs.existsSync(filename)) {
    var content = fs.readFileSync(filename).toString();
    var ast = transform.parse(content);

    transform.addImport(ast, name, moduleName);

    fs.writeFileSync(filename, transform.print(ast));
    addService(filename, name);
  }
}

function createEnvFile(filename) {
  if (!fs.existsSync(filename)) {
    var fileContents = 'MY_CONFIG_VAR=my_val';
    fs.writeFileSync(filename, fileContents, { encoding: 'utf8' });
  }
}

function linkIOS(filename, projName) {
  if (fs.existsSync(filename)) {
    (function () {
      var fileContents = fs.readFileSync(filename, { encoding: 'utf8' }).split('\n');
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
      fs.writeFileSync(filename, fileContents, { encoding: 'utf8' });
    })();
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}

function linkAndroid(filename) {
  if (fs.existsSync(filename)) {
    var fileContents = fs.readFileSync(filename, { encoding: 'utf8' }).split('\n');
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
    this.log('Installing react-native-config as a project dependency...');
    this.npmInstall(['react-native-config@0.3.1'], { save: true });
    // this.npmInstall(['reazy-native-config@0.0.3'], {save: true}, function () {
    self.spawnCommandSync('react-native', ['link', 'react-native-config']);
    linkIOS(iosProjPath, self.props.name);
    linkAndroid(androidBuildGradlePath);
    // });

    // Automatically import the new service into services/index.js and initialize it.
    importService(appJsPath, 'reazyNativeConfig', 'reazy-native-config');
    createEnvFile(envPath);
    createEnvFile(envExamplePath);
  }
});