import makeDebug from 'debug';

const debug = makeDebug('reazy:configuration');

export default module.exports = function (conf) {
  return function () {
    let app = this;

    if (!app) {
      return {};
    }

    if(process.env.NODE_ENV === 'production') {
      if(conf)
        conf = conf.production;
    }
    else {
      if(conf)
        conf = conf.default;
    }

    Object.keys(conf).forEach(name => {
      let value = conf[name];
      debug(`Setting ${name} configuration value to`, value);
      app.set(name, value);
    });

    return {
      myFunc: () => {
        return 'test successful';
      }
    }
  };
};
