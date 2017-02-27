import fs from 'fs';

export default function linkAndroid(filename) {
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
