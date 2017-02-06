var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var transform = require('../../lib/transform');

function addService(filename, name) {
  let fileContents = fs.readFileSync(filename, {encoding: 'utf8'}).split('\n');
  let indexOfApp = fileContents.length - 1;
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
  fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
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
    const fileContents = 'MY_CONFIG_VAR=my_val';
    fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
  }
}

function linkIOS(filename, projName) {
  if (fs.existsSync(filename)) {
    let fileContents = fs.readFileSync(filename, {encoding: 'utf8'}).split('\n');
    let lineNumbers = [];
    fileContents.filter(function (word, index) {
      if (word.indexOf('INFOPLIST_FILE = ' + projName + '/Info.plist;') !== -1) {
        lineNumbers.push(index);
        return true;
      }
      return false;
    });
    // console.log('lineNumbers', lineNumbers);
    lineNumbers.forEach(lineNumber => {
      fileContents.splice(lineNumber + 1, 0, `
                                  INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";
                                  INFOPLIST_PREFIX_HEADER = "\${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";
                                  INFOPLIST_PREPROCESS = YES;`);
    });

    fileContents = fileContents.join('\n');
    fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}

function linkAndroid(filename) {
  if (fs.existsSync(filename)) {
    let fileContents = fs.readFileSync(filename, {encoding: 'utf8'}).split('\n');
    let lineNumber = 0;
    fileContents.filter(function (word, index) {
      if (word.indexOf('apply plugin: "com.android.application"') !== -1) {
        lineNumber = index;
        return true;
      }
      return false;
    });
    fileContents.splice(lineNumber + 1, 0, `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`);

    fileContents = fileContents.join('\n');
    fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
  } else {
    console.log('Make sure that the Android project exists');
  }
}

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
    const appJsPath = this.destinationPath('src/app.js');
    const envPath = this.destinationPath('.env');
    const envExamplePath = this.destinationPath('.env.example');
    const iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    const androidBuildGradlePath = this.destinationPath('android/app/build.gradle');

    const self = this;
    this.log('Installing react-native-config as a project dependency...');
    this.npmInstall(['react-native-config@0.3.1'], {save: true});
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
