import fs from 'fs';

export default function linkIOS(filename, projName) {
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
