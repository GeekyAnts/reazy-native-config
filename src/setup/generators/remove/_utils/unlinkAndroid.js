import fs from 'fs';

export default function unlinkAndroid(filename) {
  if (fs.existsSync(filename)) {
    let fileContents = fs.readFileSync(filename, {encoding: 'utf8'});

    fileContents = fileContents.replace(`apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`, '');

    fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
  } else {
    console.log('Make sure that the Android project exists');
  }
}
