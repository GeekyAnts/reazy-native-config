import yeoman from 'yeoman-environment';

const env = yeoman.createEnv();

env.register(__dirname + '/generator', 'reazy-native-config');

env.run('reazy-native-config', { disableNotifyUpdate: true });
