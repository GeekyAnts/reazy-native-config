import makeDebug from 'debug';
import config from 'react-native-config';

const debug = makeDebug('reazy:configuration');

export default module.exports = function () {
  return function (serviceName) {
    let app = this;

    if (!app) {
      return {};
    }

    app.set(serviceName, config);

    return config;
  };
};
