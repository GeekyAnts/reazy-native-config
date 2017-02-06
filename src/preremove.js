import yeoman from 'yeoman-environment';

const env = yeoman.createEnv();

env.register(__dirname + '/generators/remove', 'reazy-native-config-remove');

env.run('reazy-native-config-remove', { disableNotifyUpdate: true });
