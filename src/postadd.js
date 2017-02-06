import yeoman from 'yeoman-environment';

const env = yeoman.createEnv();

env.register(__dirname + '/generators/add', 'reazy-native-config-add');

env.run('reazy-native-config-add', { disableNotifyUpdate: true });
