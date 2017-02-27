import {runGenerator} from 'reazy-setup-helper';
import path from 'path';

const add = (cb) => {
  runGenerator(path.join(__dirname, 'generators', 'add'), 'reazy-native-config-add', cb);
};

const remove = (cb) => {
  runGenerator(path.join(__dirname, 'generators', 'remove'), 'reazy-native-config-remove', cb);
};

export { add, remove }
