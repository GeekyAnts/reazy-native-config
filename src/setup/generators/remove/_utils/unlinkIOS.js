import fs from 'fs';

export default function unlinkIOS(filename, projName) {
  if (fs.existsSync(filename)) {
    let fileContents = fs.readFileSync(filename, {encoding: 'utf8'});
    fileContents = fileContents.replace('INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";', '');
    fileContents = fileContents.replace('INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";', '');
    fileContents = fileContents.replace('INFOPLIST_PREPROCESS = YES;', '');

    // These lines appear twice
    fileContents = fileContents.replace('INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";', '');
    fileContents = fileContents.replace('INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";', '');
    fileContents = fileContents.replace('INFOPLIST_PREPROCESS = YES;', '');
    try {
      fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
    } catch(err) {
      console.log('err', err);
    }
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}
